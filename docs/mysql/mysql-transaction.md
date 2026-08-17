# MySQL 事务

### 事务是一组要么全成要么全撤的操作

转账时扣款和入账必须落在同一个事务里：中间任何一步失败，两边都回到开始。InnoDB 用 undo 回滚（原子性），用 redo 做崩溃恢复（持久性），用锁和 MVCC 做隔离，最终保证一致性。

### ACID 各自靠什么实现

- **原子性 Atomicity**：中间失败就回到开始，靠 undo log。
- **一致性 Consistency**：余额不为负、约束不被破坏，是事务的目标；另外三个是手段。
- **隔离性 Isolation**：未提交的改动默认不让别的事务随便看见，靠锁和 MVCC。
- **持久性 Durability**：提交后宕机也不丢，靠 redo 刷盘；binlog 用于复制和备份。

提交时 InnoDB 会对 redo 和 binlog 做**两阶段提交**，避免引擎和 binlog 一个写成功、一个没写，主从数据对不上。

### 并发会破坏哪些一致性

- **脏读**：读到别人还没提交的改动，对方一回滚，手里就是假数据。
- **不可重复读**：同一事务两次读同一行，中间被别人改并提交，值变了。针对「行被改」。
- **幻读**：同一条件两次读，行数变了——别人插入或删除了符合条件的行。针对「行集合变了」。
- **丢失更新**：两个事务都改同一行，后提交的覆盖先提交的，没有基于最新值累加。

不可重复读和幻读容易混。前者是同一行内容变了，后者是多了或少了行。

### 隔离级别：标准表和 InnoDB 不是同一张图

SQL 标准：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| READ UNCOMMITTED | 可能 | 可能 | 可能 |
| READ COMMITTED | 否 | 可能 | 可能 |
| REPEATABLE READ | 否 | 否 | 标准上可能 |
| SERIALIZABLE | 否 | 否 | 否 |

MySQL 默认 **REPEATABLE READ**。把标准表直接套到 InnoDB 会误判幻读：

- RR 下普通 `SELECT` 是快照读，同一事务反复读同一份 Read View，看不到别人后来插入的行
- `SELECT ... FOR UPDATE` / `UPDATE` / `DELETE` 是当前读，InnoDB 用 Next-Key Lock（记录锁 + 间隙锁）堵住间隙，减少幻读
- 快照读和当前读混用、自己插入后再读，仍可能感觉到「幻象」
- SERIALIZABLE 的语义是「并发结果等价于某种串行顺序」，不是把所有事务排成单线程队列

### InnoDB 怎样实现隔离

| 级别 | 普通 SELECT | 当前读 |
| --- | --- | --- |
| READ UNCOMMITTED | 读最新，几乎无 MVCC | 锁 |
| READ COMMITTED | 每条语句一个 Read View | 记录锁，语句结束可释放间隙相关锁 |
| REPEATABLE READ | 第一次一致性读创建 Read View，之后复用 | Next-Key Lock，事务结束才放 |
| SERIALIZABLE | 普通 SELECT 升级成当前读（相当于加共享锁） | 锁直到事务结束 |

不少资料写「RC/RR 读的时候加共享锁」，那是传统锁实现。InnoDB 普通 `SELECT` 默认**不加行锁**，靠 MVCC 读可见版本。

### MVCC：用版本链换读写不阻塞

Multi-Version Concurrency Control 让读尽量不加锁。先分两种读：

- **快照读**：普通 `SELECT`，读可见版本，不加行锁
- **当前读**：`SELECT ... FOR UPDATE`、`LOCK IN SHARE MODE`、`UPDATE`、`DELETE`，读最新并加锁

行上隐藏列：

- `DB_TRX_ID`：最后修改这条记录的事务 ID
- `DB_ROLL_PTR`：指向 undo 里的上一个版本
- `DB_ROW_ID`：没有主键时才用来生成聚簇索引

更新不是把旧值原地抹掉完事，而是把旧值写进 undo，串成版本链。Read View 决定当前事务能看见链上哪一版：

- 自己改的可见
- 在 Read View 创建前已提交的可见
- 创建时还活跃、或之后才启动的事务，其改动不可见

**RC 和 RR 的差别主要在 Read View 何时创建**：RC 每条语句新建，所以能读到其他事务已提交的新值；RR 第一次快照读建一次、后面复用，同一事务里行内容稳定。

MVCC 解决读写冲突和大部分脏读 / 不可重复读，**不能替代锁去解决写写冲突和丢失更新**。丢失更新要在应用层用版本号，或在数据库用 `SELECT ... FOR UPDATE`。
