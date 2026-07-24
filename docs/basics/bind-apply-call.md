# bind、apply、call 的区别及内在实现

## 简介

这三个方法都在改变函数的 `this` 指向，但改完之后的行踪完全不同。面试必问，随手写业务代码也常碰到。

## 核心概念

### 一句话区别

- **`call`**：改 this 后立刻执行，参数逐个传
- **`apply`**：改 this 后立刻执行，参数用数组传
- **`bind`**：改 this 后不执行，返回一个新函数等你调

```js
function greet(greeting, name) {
  console.log(`${greeting}, ${name}`)
}

greet.call(null, 'Hello', '小明')   // "Hello, 小明"
greet.apply(null, ['Hi', '小红'])   // "Hi, 小红"
const fn = greet.bind(null, 'Hey')
fn('小刚')                          // "Hey, 小刚"
```

### 手写 call

```js
Function.prototype.myCall = function(context, ...args) {
  context = context || window
  const key = Symbol()            // 用 Symbol 避免覆盖已有属性
  context[key] = this             // this 就是调用 myCall 的函数
  const result = context[key](...args)
  delete context[key]
  return result
}
```

思路很简单：把函数临时挂到 `context` 上，用 `context` 调用它，`this` 自然就指过去了。

### 手写 apply

和 `call` 几乎一样，只是参数处理不同：

```js
Function.prototype.myApply = function(context, args) {
  context = context || window
  const key = Symbol()
  context[key] = this
  const result = args ? context[key](...args) : context[key]()
  delete context[key]
  return result
}
```

### 手写 bind

```js
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this
  return function(...args) {
    return fn.apply(context, [...boundArgs, ...args])
  }
}
```

`bind` 的返回值被 `new` 调用时，`this` 应该指向新创建的对象而不是绑定的 `context`——完整版还需要处理这个边界情况，但核心逻辑就这么几行。

## 实战场景

判断数据类型：`Object.prototype.toString.call(value)`——这是最稳妥的方案，`typeof` 和 `instanceof` 都有盲区。

借调数组方法给类数组对象：
```js
const args = Array.prototype.slice.call(arguments)
// 现在有展开运算符了，直接用 [...arguments] 更干净
```

事件处理中保持 this 指向：
```js
element.addEventListener('click', this.handleClick.bind(this))
```

## 总结

`call` 和 `apply` 立即执行，`bind` 返回新函数。底层都是用"临时代理"的方式劫持 this。面试手写记得用 Symbol 做 key 名。
