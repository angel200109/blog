# 常用 console 方法和 JS 调试


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

