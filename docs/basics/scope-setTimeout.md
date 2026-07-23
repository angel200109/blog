# 作用域：var/let/const 和经典 setTimeout 面试题

## 简介

作用域决定了变量在哪里能被访问。JavaScript 有三种作用域：全局作用域、函数作用域、块级作用域。`var` 是函数作用域，`let` 和 `const` 是块级作用域——这个差异是无数 bug 和面试题的来源。

## 核心概念

### var 的"漏网"行为

`var` 声明的变量只在函数体内有效，但它无视 `{}` 花括号的边界：

```js
if (true) {
  var x = 10;
}
console.log(x); // 10，var 跑出了 if 块
```

换成 `let` 或 `const`，`x` 就被锁在 `{}` 里了。

### 经典面试题：为什么打印 5 个 5？

```js
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// 输出 5 个 5
```

三个原因叠在一起造成的：

- `var` 没有块级作用域，`i` 是全局变量，循环 5 次用的都是同一个 `i`
- `setTimeout` 是异步的，回调被丢到任务队列，等主线程空了才执行
- 循环跑得飞快，回调执行时 `i` 早就变成 5 了

### 怎么修

**方案一：改用 `let`**（最简单）

```js
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2, 3, 4
```

`let` 让每次迭代都有独立的块作用域，每个回调拿到的都是当轮的 `i`。

**方案二：IIFE 闭包**（`var` 时代的解法）

```js
for (var i = 0; i < 5; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

用立即执行函数把当前 `i` 的值"快照"下来传给 `j`。

## 实战场景

写事件循环相关的代码时，时刻提醒自己：`var` 声明的循环变量会在回调执行时变成最终值。Vue 的 `setup`、React 的 `useEffect` 里如果用了 `var` 做循环 + 异步，踩坑概率极高。

## 总结

`var` 是函数作用域，`let`/`const` 是块级作用域。异步 + 循环 + `var` = 经典陷阱。日常开发直接用 `const` 和 `let`，忘掉 `var`。
