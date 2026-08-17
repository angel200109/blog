# MySQL 索引

### 索引解决什么问题

索引是存储引擎用来快速定位行的数据结构。InnoDB 默认是 B+ 树：非叶子节点只存键和指针，叶子节点按键有序，并用指针串成链表。没有合适索引时，引擎只能从聚簇索引一头扫到尾。

一页默认 16KB。千万级行的 B+ 树高度通常只有 3~4 层，一次点查对应几次页读取。这比在堆里随机翻行便宜得多。

### 优点和代价

索引把随机 IO 收成更少的有序查找，WHERE、JOIN、ORDER BY、GROUP BY 都可能受益。叶子链表还让范围扫描可以顺着页走，不必反复回根节点。

代价同样明确：每棵二级索引都占磁盘和 Buffer Pool；INSERT / UPDATE / DELETE 都要维护它；选错索引会让优化器走错计划，查询更慢。写多读少、几乎不出现在条件里的列，建了就是负收益。

「有索引就一定更快」不成立。回表次数接近全表扫描时，优化器可能直接放弃索引（index dive 认为扫描量不划算）。以 `EXPLAIN` 为准。

### 为什么用 B+ 树而不是 B 树或哈希

B 树的内部节点也存值，找到内部节点就能返回。B+ 树内部节点只存键，**所有值都在叶子**，叶子再串成链表。

数据库选 B+ 树，是因为它更贴合磁盘页：

- 内部节点不存行，一页能塞更多路标，扇出更大、树更矮，IO 更少
- 叶子链表天然支持 `BETWEEN`、`ORDER BY`
- 无论命中哪条，都是根到叶，路径长度稳定

红黑树、二叉平衡树扇出是 2，千万行高度会到二十多层，不适合磁盘索引。B 树可以把热点值放得靠近根，更偏内存里的随机点查，不是 InnoDB 这种页式存储的主路径。

哈希表等值查找是 O(1)，但无序：不能排序、不能范围、不能最左前缀，冲突时性能还会抖。InnoDB 用户能建的主要是 B+ 树。所谓哈希，更多是 Buffer Pool 里自动维护的**自适应哈希索引**，不能给普通 InnoDB 表写 `USING HASH`。真正的 HASH 索引出现在 MEMORY / NDB。

| | Hash | B+ 树 |
| --- | --- | --- |
| 等值查询 | 很快 | 稳定，略慢于理想哈希 |
| 范围 / 排序 / 分组 | 不支持 | 支持 |
| 最左前缀 / 前缀 LIKE | 不支持 | 支持 |
| 冲突 | 可能退化 | 每次都是根到叶 |
| InnoDB 场景 | 自适应哈希，系统自己用 | 默认、主力 |

### 类型和种类

按底层实现：

- **BTREE**：InnoDB / MyISAM 默认
- **HASH**：MEMORY 等；InnoDB 不让用户直接建
- **FULLTEXT**：InnoDB 5.6.4+ 支持，用来解决 `LIKE '%词%'` 这类文本检索
- **SPATIAL**：地理范围
- **函数索引**（MySQL 8.0.13+）：对表达式建索引，缓解「列上套函数导致用不了索引」

按用途：

- **主键**：唯一且非空，一张表一个，InnoDB 里就是聚簇索引
- **唯一索引**：值唯一；NULL 在 MySQL 唯一索引里可以出现多次
- **普通索引**：允许重复和 NULL
- **联合索引**：多列组成一棵 B+ 树，遵循最左前缀
- **全文索引**：文本倒排

没有显式主键时，InnoDB 会选第一个唯一非空索引；再没有就生成隐藏的 `DB_ROW_ID`。隐藏主键无法被业务引用，更新删除特定行会很别扭，所以表还是要有自己的主键。

### 聚簇索引、二级索引与回表

核心差别是数据和索引是否在一起。

- **聚簇索引**：叶子节点就是整行。InnoDB 主键即聚簇索引，表数据按主键顺序排。
- **二级索引（非聚簇）**：叶子节点存「索引列 + 主键」。要整行时拿主键再回聚簇索引，这一步叫回表。

MyISAM 的主键和二级索引都是非聚簇，叶子存行指针，二级索引不必再绕一次主键。

InnoDB 插入主键尽量用递增（自增或有序雪花）。UUID 这种随机主键会在页中间插入，页分裂和碎片都会上去；所有二级索引的叶子还要带着这个又长又乱的键。

### 覆盖索引：二级索引不一定回表

查询列都能从二级索引叶子拿到，就是覆盖索引，`EXPLAIN` 的 Extra 里常见 `Using index`。

InnoDB 二级索引叶子已经带主键，所以 `INDEX(name)` 时：

```sql
SELECT id, name FROM user WHERE name = 'zhangsan';
-- 覆盖，不回表

SELECT id, name, age FROM user WHERE name = 'zhangsan';
-- 要 age，回表
```

高频查询可以把列加进联合索引，例如 `(name, age)`。覆盖的判定是「查询列 ⊆ 索引列（含主键）」，`SELECT *` 几乎不可能被覆盖。

### 最左前缀与前缀索引

联合索引 `(a, b, c)` 按 a、再 b、再 c 排序。必须从最左连续使用，**范围条件会截断后面的列**。

| SQL | 用到的列 |
| --- | --- |
| `WHERE a=1 AND b=2 AND c=3` | a, b, c（优化器会重排等值条件） |
| `WHERE a=1 AND b=2` | a, b |
| `WHERE a=1` | a |
| `WHERE b=1` / `WHERE b=1 AND c=2` | 都用不上 |
| `WHERE a=1 AND c=2` | 只有 a |
| `WHERE a=1 AND b>3 AND c=1` | a, b；c 用不上 |
| `WHERE a LIKE 'ab%'` | a 能用 |
| `WHERE a LIKE '%ab'` | 用不上 |

没有用到 `a` 的等值时，`ORDER BY b` 也不能靠这棵索引避免 filesort。联合索引的顺序一般是「等值列在前，范围列在后」。

前缀索引只对字符串前 N 个字符建树，索引更小，但区分度不够会扫很多叶子，也不能拿它做完整列的 `ORDER BY` 或覆盖查询：

```sql
SELECT COUNT(DISTINCT name) / COUNT(*) FROM user;
SELECT COUNT(DISTINCT LEFT(name, 8)) / COUNT(*) FROM user;

ALTER TABLE user ADD INDEX idx_name_prefix (name(8));
```

### 设计原则与「失效」

为过滤、连接、排序列建索引，不为 SELECT 列表里顺便查出的列盲目建。区分度低的列（如性别）单独建索引收益很小；多列经常一起过滤，优先联合索引，而不是一人一个单列。

小表全表扫描往往更快。超大表单靠索引不够时，再考虑分区或分库分表。

常见让优化器放弃或用不好索引的写法：

- 列上套函数或运算：`WHERE YEAR(create_time)=2026`，改成时间范围
- 隐式类型转换：`phone` 是 VARCHAR，却写 `WHERE phone = 13800138000`
- `LIKE '%abc'` 前导通配；`LIKE 'abc%'` 可以用
- `OR` 一侧没索引，容易全表扫；两边都有索引时可能走 index merge，仍要看代价
- 最左前缀断裂、范围截断

`!=`、`<>`、`NOT IN` **不一定绝对失效**，选择性差时优化器常改全表扫描。`IS NULL` 在 InnoDB 里**可以用索引**，不是「遇到 NULL 索引就废」。MySQL 8 还可用函数索引给不得不写表达式的查询补救。

优化时看 `EXPLAIN` / `EXPLAIN ANALYZE`（8.0.18+）有没有 `type=ALL`、`Using filesort`、`Using temporary`。重复索引、从未使用的索引可以删（`sys.schema_unused_indexes`）。

### 创建与删除

```sql
CREATE INDEX idx_user_name ON user (name);
ALTER TABLE user ADD INDEX idx_user_name (name);
ALTER TABLE user ADD UNIQUE INDEX uk_user_email (email);
ALTER TABLE user ADD INDEX idx_name_prefix (name(8));

ALTER TABLE user DROP INDEX idx_user_name;
ALTER TABLE user DROP PRIMARY KEY;
```

建表时也可以直接写 `PRIMARY KEY` / `KEY` / `UNIQUE KEY` / `FULLTEXT KEY`。大表加索引用 Online DDL，避免长时间锁表。
