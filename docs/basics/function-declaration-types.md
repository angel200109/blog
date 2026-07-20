# JS 里定义函数的六种姿势

## 简介

JS 定义函数的方式多到让人眼花。不同写法不只是语法糖的区别，`this` 绑定、提升行为、使用场景都不一样。把这几种搞清楚，看别人的代码才不懵。

## 核心概念

### 函数声明

```javascript
function say() {
  console.log("say");
}
```

会整体提升，可以在声明前调用。最"经典"的写法。

### 函数表达式

```javascript
const hi = function () {
  console.log("hi");
};
const greet = function greet() {  // 具名
  console.log("greet");
};
```

赋值发生在运行时，不会提升。具名表达式的名字只在函数内部可访问，方便调试和递归。

### 箭头函数

```javascript
const hello = () => {
  console.log("hello");
};
```

不绑定自己的 `this`，从外层作用域继承。不能当构造函数，也没有 `arguments` 对象。写回调的时候无敌方便。

### 立即执行函数（IIFE）

```javascript
(function () {
  console.log("IIFE");
})();
(() => {
  console.log("箭头 IIFE");
})();
```

声明的同时立即执行，创建一个独立作用域。在模块化普及以前是避免全局污染的标配手段，现在用得少了，但看老代码还是会遇到。

### 对象方法简写

```javascript
const obj = {
  onCreate() { console.log("Created"); },              // 简写，推荐
  onCreate: function () { console.log("Created"); },   // 传统
  onCreate: () => { console.log("Created"); },         // 箭头（this 是外层的）
};
```

简写是 ES6 的语法糖，和传统 `function` 写法行为一致。别用箭头函数定义对象方法——`this` 不会指向对象本身。

### 构造函数写法

```javascript
// ES5
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {};

// ES6 class
class Animal {
  constructor(name) { this.name = name; }
  speak() {}
}
```

class 本质上是构造函数的语法糖，但写起来清晰太多，还支持 extends 和 super。

## 实战场景

日常开发里用得最多的组合：**箭头函数做回调 + 方法简写做对象方法 + class 做组件/模型**。IIFE 偶尔在脚本文件的顶层包裹一下，防止污染全局。

## 总结

函数声明会提升，表达式不会。箭头函数没自己的 this，对象方法用简写。选哪种写法取决于你需要什么行为，不是越新越好。
