# 常用 console 方法和 JS 调试

## 简介

`console.log` 可能是前端最频繁调用的 API 之一，但 `console` 家族远不止这一个方法。知道每个方法的特点，调试效率能翻倍。

## 核心概念

### 基础输出四件套

```js
console.log('普通日志')
console.info('信息，行为跟 log 一样')
console.warn('警告，黄色背景+堆栈')
console.error('错误，红色背景+堆栈')
```

`warn` 和 `error` 会带上调用栈，排查问题时比 `log` 有用得多。而且可以在 Chrome DevTools 里按级别筛选。

### 结构化输出

```js
const users = [{ name: '张三', age: 28 }, { name: '李四', age: 32 }]
console.table(users) // 表格形式，一目了然

console.group('用户模块')
console.log('加载中...')
console.log('加载完成')
console.groupEnd()
// group 可以嵌套，折叠起来很清爽
```

### 性能相关

```js
console.time('接口耗时')
await fetch('/api/data')
console.timeEnd('接口耗时') // 输出：接口耗时: 234ms
```

比手动 `Date.now()` 相减方便太多了。

### 样式输出

```js
console.log('%c重要提醒', 'color: red; font-size: 20px')
```

第一个参数里的 `%c` 会被第二个参数的 CSS 样式替换。在大量的 `console.log` 里标记关键信息时很好用。

### 断言和计数

```js
console.assert(age > 18, '用户未成年') // 条件为 false 时输出
console.count('request') // 每次调用计数+1
```

## 实战场景

调试接口数据时，先 `console.table` 看数据结构，再用 `console.time` 检查耗时。线上出现偶发 bug，在关键位置加 `console.warn`，DevTools 里一眼就能看到那一抹黄色。

另外，可以用 `console.trace()` 输出完整调用栈，搞清楚某个函数到底是谁调起的——比打断点省时间。

## 总结

`console` 不只是打印日志的工具，它是一个完整的调试工具箱。`table`、`time`、`group`、`trace` 这四个方法，用熟了就很难再回到 `console.log` 一条路走到黑了。
