# Promise.all/allSettled/any/race 怎么选

## 简介

Promise 的四个静态组合方法，看着名字类似，用起来场景完全不同。搞混了不是语法报错的问题——是逻辑直接跑偏。

## 核心概念

这四个方法都接收一个 Promise 数组（或其他可迭代对象），区别在于"什么时候结束"和"怎么处理失败"。

### Promise.all

**全部成功才进入 then，有一个失败就进 catch。** 结果按传入顺序排列。

```javascript
const [data1, data2, data3] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);
```

适合那种"缺一个数据页面就不能渲染"的场景——首页多个模块的初始化数据、表单多个校验等。

### Promise.allSettled

**等所有 Promise 都完成（不论成败），一定会进 then。** 返回每个 Promise 的状态和结果。

```javascript
const results = await Promise.allSettled([p1, p2, p3]);
// [{ status: 'fulfilled', value: 'rp1' },
//  { status: 'rejected',  reason: 'rp2' },
//  { status: 'rejected',  reason: 'rp3' }]
```

适合"尽可能多地完成任务，个别失败没关系"的场景——埋点上报、批量处理日志、多数据源聚合展示。

### Promise.any

**有一个成功就立刻进 then，全部失败才进 catch。** 返回第一个成功的结果。

```javascript
const fastestCDN = await Promise.any([
  fetch('https://cdn1.com/resource'),
  fetch('https://cdn2.com/resource'),
  fetch('https://cdn3.com/resource'),
]);
```

适合"多个备份源，哪个通就先用哪个"——CDN 容灾、抢票系统、服务降级。

### Promise.race

**谁先完成（不管成败）就用谁的结果。** 成功了进 then，失败了进 catch。

```javascript
// 请求超时控制
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) => setTimeout(() => reject('超时'), 3000))
]);
```

适合"超时控制、抢占式竞速"——给请求加个定时炸弹，超时就报错。

## 实战场景

一个常见的坑：很多人用 `Promise.all` 去发没有依赖的请求，然后纳闷"为啥这么慢"——其实没依赖就该用 `Promise.all`，但别在 for 循环里一个个 await。

## 总结

| 方法 | 结束条件 | 失败影响 | 典型场景 |
|------|---------|---------|---------|
| all | 全部完成 | 一个失败全完 | 页面初始化数据 |
| allSettled | 全部完成 | 不影响 | 埋点上报 |
| any | 一个成功 | 全失败才报 | CDN 容灾 |
| race | 一个完成 | 看第一个 | 超时控制 |
