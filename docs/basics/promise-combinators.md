# Promise.all / allSettled / any / race 怎么选

### 四种方法的共同点

`Promise.all`、`Promise.allSettled`、`Promise.any`、`Promise.race` 都接收一个可迭代对象（通常是 Promise 数组），用于同时管理多个异步操作。它们的区别在于"什么时候完成"和"结果如何处理"，选哪个取决于业务对失败和结果顺序的容忍度。

### Promise.all：全部成功才成功

**行为**：所有 Promise 都成功才进入 `.then()`，返回按输入顺序排列的结果数组；任意一个失败立即进入 `.catch()`，拿到第一个失败的错误。

```javascript
const userTask = new Promise((resolve) => setTimeout(resolve, 2000, { name: 'Alice' }));
const orderTask = new Promise((resolve) => setTimeout(resolve, 3000, { total: 128 }));
const configTask = new Promise((resolve) => setTimeout(resolve, 1000, { theme: 'dark' }));

Promise.all([userTask, orderTask, configTask]).then((results) => {
  console.log(results); // [{ name: 'Alice' }, { total: 128 }, { theme: 'dark' }]
});
// 三个任务耗时不同，但结果顺序与输入顺序一致
```

只要有任意一个失败就进入 `.catch()`：

```javascript
const task1 = new Promise((resolve) => setTimeout(resolve, 2000, 'ok'));
const task2 = new Promise((_, reject) => setTimeout(reject, 3000, 'timeout'));
const task3 = new Promise((_, reject) => setTimeout(reject, 1000, 'aborted'));

Promise.all([task1, task2, task3])
  .then((results) => console.log(results))
  .catch((err) => console.log(err)); // 'aborted'——第一个失败的是 task3
```

**适用场景**：首页多个模块并行渲染、表单多字段校验——任何一个环节失败都不应该继续。

### Promise.allSettled：等所有结果，无论成败

**行为**：等待所有 Promise 完成，不会进入 `.catch()`，返回每个任务的状态和结果。

```javascript
const tasks = [
  Promise.resolve('用户数据加载成功'),
  Promise.reject('订单数据加载失败'),
  Promise.resolve('配置加载成功'),
];

Promise.allSettled(tasks).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: '用户数据加载成功' },
  //   { status: 'rejected', reason: '订单数据加载失败' },
  //   { status: 'fulfilled', value: '配置加载成功' },
  // ]
});
```

**适用场景**：前端埋点日志上报、批量文件上传——部分失败不影响整体，需要知道每个任务的结果状态。

### Promise.any：有一个成功就行

**行为**：只要有一个 Promise 成功，立即进入 `.then()` 拿到该结果；全部失败才进入 `.catch()`。

```javascript
const cdn1 = new Promise((resolve) => setTimeout(resolve, 2000, 'CDN-A 可用'));
const cdn2 = new Promise((resolve) => setTimeout(resolve, 3000, 'CDN-B 可用'));
const cdn3 = new Promise((_, reject) => setTimeout(reject, 1000, 'CDN-C 不可用'));

Promise.any([cdn1, cdn2, cdn3]).then((result) => {
  console.log(result); // 'CDN-A 可用'——第一个成功的
});
```

全部失败时进入 `.catch()`，返回 AggregateError：

```javascript
const allFailed = [Promise.reject('A'), Promise.reject('B'), Promise.reject('C')];
Promise.any(allFailed)
  .then((r) => console.log(r))
  .catch((err) => console.log(err.errors)); // ['A', 'B', 'C']
```

**适用场景**：从多个 CDN 中找一个可用的、抢票系统——一个成功就能继续。

### Promise.race：最快那个决定结果

**行为**：第一个完成的 Promise（无论成功还是失败）决定整个结果。

```javascript
const slowTask = new Promise((resolve) => setTimeout(resolve, 3000, '慢'));
const fastTask = new Promise((resolve) => setTimeout(resolve, 1000, '快'));

Promise.race([slowTask, fastTask]).then((result) => {
  console.log(result); // '快'
});

// 失败案例
const timeout = new Promise((_, reject) => setTimeout(reject, 1000, '超时'));
const fastFailTask = new Promise((resolve) => setTimeout(resolve, 500, '成功'));
// timeout 先完成，race 失败
```

**适用场景**：请求超时控制——同时发起请求和一个超时 Promise，谁先完成听谁的：

```javascript
const fetchData = fetch('/api/order/list');
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject('请求超时'), 3000)
);

Promise.race([fetchData, timeout])
  .then((res) => console.log('请求成功', res))
  .catch((err) => console.error('失败', err));
```

如果请求在 3 秒内完成，race 走成功的 then；超过 3 秒则 timeout 抢先完成，race 走 catch。

### 选择速查

| 方法 | 完成条件 | 失败处理 | 典型场景 |
|------|---------|---------|---------|
| `all` | 全部成功 | 一个失败即终止 | 首页并行渲染 |
| `allSettled` | 全部完成 | 不会进 catch | 埋点上报、批量上传 |
| `any` | 一个成功就行 | 全失败才进 catch | CDN 择优、抢票 |
| `race` | 第一个完成 | 取决于第一个的结果 | 超时控制 |
