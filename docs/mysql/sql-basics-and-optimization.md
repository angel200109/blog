# SQL 基础与优化

### SQL 分类与约束

- **DDL**：`CREATE` / `ALTER` / `DROP`，改表结构、索引、库
- **DQL**：`SELECT`
- **DML**：`INSERT` / `UPDATE` / `DELETE`
- **DCL**：`GRANT` / `REVOKE`。`COMMIT` / `ROLLBACK` 属于事务控制（TCL），有的资料归到 DCL

常见约束：

- **主键**：唯一标识一行，非空，一张表一个
- **外键**：引用另一表主键。InnoDB 支持；高并发系统常在应用层保证，避免级联锁把多张表锁在一起
- **唯一**：允许 NULL
- **默认值**、**NOT NULL**
- **CHECK**：MySQL 8.0.16+ 才真正生效

### 子查询

一个查询的结果参与另一个查询：

- **标量**：返回一个值，`WHERE age = (SELECT MAX(age) FROM user)`
- **列**：n 行 1 列，配合 `IN` / `ANY` / `ALL`
- **行**：1 行 n 列，`WHERE (age, city) = (...)`
- **表**：n 行 n 列，放在 `FROM` 里当派生表

能改写成 JOIN 时，很多场景 JOIN 更好优化。相关子查询每一行都执行一次内层，数据量大时要小心。

### JOIN

- **INNER JOIN**：只保留两端都匹配的行
- **LEFT JOIN**：保留左表全部，右表对不上就是 NULL
- **RIGHT JOIN**：保留右表全部
- **FULL OUTER JOIN**：MySQL 没有原生语法，用 `LEFT JOIN UNION RIGHT JOIN` 模拟
- **CROSS JOIN**：笛卡尔积。`FROM left_table, right_table` 不写 `ON` 就是它

过滤条件写在 `ON` 还是 `WHERE`，对左连接影响很大。`WHERE` 里写右表列 `IS NOT NULL`，等价于把左连接滤成内连接。

### IN 与 EXISTS

旧经验是：内表小用 `IN`（先物化内表），外表小、内表大用 `EXISTS`（外表驱动，内表点查）。现在优化器经常把 `IN` 子查询改写成 semi-join，两者差别没那么绝对，以 `EXPLAIN` 为准。

仍然成立的点：

- `NOT IN` 遇到 NULL 会得到空结果（三值逻辑）。优先 `NOT EXISTS` 或 `LEFT JOIN ... WHERE right.id IS NULL`
- `IN` 列表本身太大也会慢，可改 JOIN

### CHAR、VARCHAR 与 INT(10)

`CHAR` 定长，短了补空格（检索时去掉尾部空格），长度几乎不变、频繁原地更新时可以考虑。`VARCHAR` 变长，多 1~2 字节长度头，更省空间，多数列的默认选择。

`CHAR` 上限 255 字符；`VARCHAR` 上限在 65535 字节量级，还要扣掉行格式、NULL 标志和其他列。`utf8mb4` 下单列上限会更小。

`INT(10)` 仍然是 4 字节整数，`10` 只影响 `ZEROFILL` 时左边补零显示。8.0 已废弃显示宽度。`CHAR(10)` / `VARCHAR(10)` 才是最多 10 个字符的存储长度。

### DROP、DELETE、TRUNCATE

| | DROP | DELETE | TRUNCATE |
| --- | --- | --- | --- |
| 类型 | DDL | DML | DDL（实现上整表重建） |
| 内容 | 表结构 + 数据 + 索引都没了 | 可带 WHERE 删行，结构还在 | 清空全部行，结构还在 |
| 回滚 | 不能 | 事务里可以 | 一般不能（隐式提交） |
| 速度 | 快 | 逐行、写 undo，慢 | 快 |
| 自增 | 表没了 | 通常不重置 | 通常重置 |

删部分行用 `DELETE`；清空大表用 `TRUNCATE`；不要这张表了用 `DROP`。

### UNION 与临时表

`UNION` 和 `UNION ALL` 都合并结果集。`UNION` 会去重（隐含排序或去重），`UNION ALL` 原样拼接。不需要去重就用 `UNION ALL`，少一次临时表。列数、类型要兼容；`ORDER BY` 默认只对整个 UNION 的最终结果生效，需要给子查询加括号。

优化器为排序、去重、UNION、派生表等创建的中间表叫临时表，只对当前会话可见，语句或连接结束就释放。`EXPLAIN` 里出现 `Using temporary`、`DISTINCT` 搭配另一套 `ORDER BY`、`GROUP BY` 与 `ORDER BY` 列不一致，都可能触发。

内存里用 MEMORY / TempTable，撑不住落到磁盘。MySQL 8.0 磁盘临时表不再依赖 MyISAM。大排序会拖垮磁盘，能靠索引避免 filesort 就避免。显式 `CREATE TEMPORARY TABLE` 也是会话级，断开自动删除。

### 主键、自增 ID 与 NOT NULL

InnoDB 必须有聚簇索引。没有主键会隐藏一个 6 字节 `ROW_ID`，既不好在业务里引用，也不方便按行更新删除。

聚簇索引按主键排列，**自增或有序雪花**插入是追加，页分裂少。UUID 随机，插入在页中间乱跳，二级索引叶子还要带着这个长键。

自增短、顺序、索引友好，但会暴露量级，合表要改号。UUID 本地生成、全局唯一、合表简单，却占空间且无序。若一定要用 UUID，至少用有序版本（UUIDv7），或把 UUID 当业务键、主键仍用 `BIGINT`。单机表默认自增；分库分表再上雪花 / Leaf。

NULL 是三值逻辑里的「未知」，不是空字符串：

- `COUNT(column)` 不计 NULL，`COUNT(*)` 计行
- `NOT IN (..., NULL)` 整个结果为空
- 比较、唯一约束、复合索引里 NULL 的语义都容易写错
- InnoDB 行格式里 NULL 仍有位图开销；二级索引**可以**包含 NULL，并不是「B 树不存 NULL 所以索引失效」

允许「没有值」的列再开 NULL；状态、金额、时间这类业务字段尽量 `NOT NULL` + 默认值。

### 慢查询

超过 `long_query_time` 的语句记入慢日志：

```sql
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1; -- 秒
SET GLOBAL log_queries_not_using_indexes = 1;
```

`slow_query_log_file` 指定路径，`log_output` 可以是 FILE 或 TABLE。分析用 `mysqldumpslow`、pt-query-digest，再 `EXPLAIN`。

优化顺序一般是：有没有索引 → 索引有没有用上 → 是不是回表 / 排序 / 临时表 → 是不是锁等待 → 再考虑改表结构。

### 少读、少算、深分页

少读：覆盖索引、避免 `SELECT *`、按时间或 ID 缩小范围、让 WHERE 用上索引。少算：能在 WHERE 滤掉的不要拿到应用再滤；加密、正则不要放在热点 SQL 里；排序列有索引，避免 filesort。加缓存、读写分离是后手，先把单条 SQL 读的页数降下来。

长难查询可以拆成多次短查询；多表 JOIN 拆开后按主键在应用层拼，分库后跨库 JOIN 本身就不该写在一条 SQL 里。先用小派生表缩小 ID 集合，再回表取宽列，就是延迟关联。

`LIMIT 1000000, 20` 会扔掉前 100 万行，越往后越慢：

```sql
-- 记住上一页最大 id
SELECT * FROM orders WHERE id > 123456 ORDER BY id LIMIT 20;

-- 延迟关联：子查询只扫覆盖索引
SELECT o.* FROM orders o
INNER JOIN (
  SELECT id FROM orders ORDER BY create_time, id LIMIT 100000, 20
) t ON o.id = t.id;
```

产品上深度翻页也应改成「下一页」，而不是跳到第 5000 页。

WHERE 不要在列上做函数、运算、隐式转换；范围列放联合索引最后；`OR` 改 `UNION ALL`，或保证两侧都能走索引；前导 `%` 的 LIKE 考虑全文索引或搜索引擎。`!=`、`NOT IN` 不是绝对不能用，但要看选择性。「WHERE 里出现 `!=` 就一定全表扫描」是过时口诀。

### 语句为什么会慢

偶尔慢：等行锁 / 间隙锁，甚至等 metadata lock（别人在 DDL）；redo 刷盘、checkpoint、刷脏页；瞬时 IO、Buffer Pool 被打满。

一直慢：没索引或有索引没用上；回表过多、filesort、临时表打磁盘；深分页、`SELECT *` 带大字段；统计信息过期，优化器选错计划（`ANALYZE TABLE`）。

用慢日志定位 SQL，用 `EXPLAIN` 看计划，用 `SHOW ENGINE INNODB STATUS` 看锁。

### 书写顺序和逻辑执行顺序

书写顺序：

```sql
SELECT DISTINCT columns
FROM t1
JOIN t2 ON ...
WHERE ...
GROUP BY ...
HAVING ...
ORDER BY ...
LIMIT ...
```

逻辑处理顺序更接近：

1. FROM / JOIN（先笛卡尔，再 ON）
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
6. DISTINCT
7. ORDER BY
8. LIMIT

所以 `WHERE` 不能用 SELECT 别名，`HAVING` 可以。MySQL 对 SELECT 别名的宽松程度因版本而异，不要依赖方言。8.0 窗口函数在 GROUP BY 之后、ORDER BY 之前求值。
