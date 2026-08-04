# JS 监听对象属性的改变


### Object.defineProperty 的 setter

这是 Vue 2 响应式的核心。给属性加个 getter/setter，一旦有人赋值就触发通知。

```js
const person = {}
let _age = 0

Object.defineProperty(person, 'age', {
  get() { return _age },
  set(val) {
    _age = val
    console.log('age 变成了', val)
  }
})

person.age = 25 // 触发 setter
```

缺点也很明显：每次只能劫持一个属性，新增属性没法自动响应，数组的 push/pop 这种操作也监听不到。Vue 2 为了解决这个问题搞了 `$set` 和重写数组方法那一大套东西。

### Proxy

ES6 的 Proxy 解决了 defineProperty 的痛点。它代理的是整个对象而非单个属性。

```js
const obj = { name: 'tom', scores: [90, 80] }
const proxy = new Proxy(obj, {
  set(target, key, value) {
    console.log(`${key} 从 ${target[key]} 变成了 ${value}`)
    target[key] = value
    return true
  },
  deleteProperty(target, key) {
    console.log(`${key} 被删了`)
    return Reflect.deleteProperty(target, key)
  }
})

proxy.name = 'jerry'   // 触发
proxy.age = 10          // 新增属性也能触发，defineProperty 做不到
proxy.scores.push(100)  // 数组操作也能拦截
```

Proxy 支持 13 种拦截操作，除了 set/get，还能拦截 delete、has、ownKeys 等。Vue 3 的响应式就是用 Proxy 重写的。

### Object.observe（已死）

Chrome 曾经有过 `Object.observe`，原生就能监听对象变化。但它设计得太复杂，性能也不好，2016 年被从标准里移除了。现在不要再想它了。

