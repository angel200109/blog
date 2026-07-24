# ES6 的继承和 ES5 的继承的区别

## 简介

JavaScript 的继承从 ES5 的"用原型链模拟类"进化到 ES6 的 `class extends`，底子没变但写法天差地别。理解两者的关系，才能看懂旧项目的代码，也能在面试时不被套路题难倒。

## 核心概念

### ES5：寄生组合式继承

ES5 最正统的写法是寄生组合式继承：

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.say = function() {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name) // 继承属性
  this.age = age
}
Child.prototype = Object.create(Parent.prototype) // 继承方法
Child.prototype.constructor = Child
```

核心思路：属性通过 `Parent.call(this)` 偷过来，方法通过原型链连起来。

### ES6：class 语法糖

```js
class Parent {
  constructor(name) { this.name = name }
  say() { console.log(this.name) }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```

`super()` 本质上就是在调用 `Parent.call(this)`，`extends` 在背后帮你连好了原型链。

### 关键区别

1. **`class` 声明不会被提升**，不像 `function` 可以先调用后定义
2. **`class` 内部默认严格模式**，不需要手动声明
3. **`class` 的方法不可枚举**，`Object.keys()` 不会出来，但 ES5 原型上的方法默认是可枚举的
4. **`class` 不能用 `new` 之外的调用**，`Parent()` 会直接报错，而 ES5 的构造函数可以被普通调用
5. **`extends` 同时继承了静态方法和属性**，ES5 要做到这一点得额外写 `Object.setPrototypeOf`

## 实战场景

项目里全是 `class extends`，但看库的源码时经常遇到 ES5 写法。比如老版 React 的 `createClass` 那一套。知道 ES5 怎么搞继承，看这些旧代码就不会一头雾水了。

## 总结

ES6 `class` 是语法糖，底层还是原型链。面试多关注 `super` 干了什么、`class` 和 `function` 的行为差异，这些坑踩过了就不会忘。
