# 伪数组不是数组，但也别慌

你有没有遇到过这种情况：拿到一个长得像数组的东西，有 `length`、能用索引访问，但一调 `forEach` 就报错？你遇到的就是"类数组"（也叫伪数组）。

## 什么是类数组

类数组就是一个对象，有数字索引和 `length` 属性，但没挂数组的那些方法（`push`、`map`、`forEach` 等）。两个最常见的例子：

```javascript
// 1. arguments 对象
function sum(a, b, c) {
  console.log(arguments[0]);   // 可以按索引访问
  console.log(arguments.length);// 有 length
  // arguments.forEach(...)     // 报错！arguments 不是数组
  return a + b + c;
}

// 2. DOM 集合
const nodes = document.querySelectorAll('.item');
// nodes.map(...)  // 报错！
```

本质上它们的原型链上只有 `Object.prototype`，没有 `Array.prototype`，所以数组的方法全都不认。

## 怎么转成真正的数组

三种常用姿势：

```javascript
// 方法 1：Array.from() —— 最推荐
const arr = Array.from(arguments);

// 方法 2：展开运算符
const arr = [...arguments];

// 方法 3：Array.prototype.slice.call()
const arr = Array.prototype.slice.call(arguments);
```

`Array.from()` 是 ES6 的官方方案，语义清楚，而且还能传第二个参数做映射：

```javascript
const arr = Array.from(arguments, x => x * 2);
```

展开运算符最简洁，但要注意它要求对象实现了 `Symbol.iterator`——`arguments` 和 `NodeList` 都支持，但不是所有类数组都支持。

老派的 `slice.call()` 是利用了 `slice` 的机制——当它检测到没有传入参数时，会把调用者转成数组。纯粹是一个"副作用"用法，现代代码里基本被淘汰了。

## 小结

类数组就是"长得像数组但不是数组"的对象。`Array.from()` 是最安全、最语义化的转化方式。下次遇到 `xxx.forEach is not a function`，先看看你拿到的到底是不是真数组。
