# const、let、var 该怎么选

## 简介

三个声明变量的关键字，从 ES6 到现在，它们的区别早已是面试标配。更大的问题是——实际写代码时怎么选？

## 核心概念

### var：老古董，能不用就别用

`var` 是函数作用域，不是块级作用域。这意味着在 `if` 或 `for` 里声明的 `var`，外面也能访问。再加上变量提升时初始化为 `undefined`，坑太多。

```javascript
if (true) {
  var x = 10;
}
console.log(x); // 10 ← 块外面居然能访问

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 输出：3 3 3 ← 经典闭包陷阱，因为 i 被提升到了函数作用域
```

### let 和 const：块级作用域

从 `{}` 开始到 `{}` 结束，外面拿不到。`const` 声明的变量不能重新赋值，`let` 可以。两者都有暂时性死区——声明之前访问会报错，而不是像 `var` 一样返回 `undefined`。

```javascript
{
  let a = 1;
  const b = 2;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

### const 声明对象时可以改属性

```javascript
const user = { name: 'angelina' };
user.name = 'tom';      // 没问题，改的是堆里的数据
user = { name: 'jerry' }; // TypeError，重新绑定了地址
```

`const` 锁的是栈里的地址，不是堆里的内容。

## 实战场景

我的选择策略很简单：

1. **默认用 `const`**——表达"这个值不会变"的意图
2. **确实需要重新赋值时才用 `let`**——比如循环计数器、累加值
3. **基本不用 `var`**——除非你在维护 2015 年之前的老代码

```javascript
const API_URL = 'https://api.example.com';  // 常量
const users = [];                            // 可以 push，不能重新赋值

for (let i = 0; i < users.length; i++) {     // 循环变量用 let
  console.log(users[i]);
}

let result = null;                            // 后面会被重新赋值
try {
  result = await fetchData();
} catch (e) {
  result = fallbackData;
}
```

## 总结

`const` 默认、`let` 需要时用、`var` 忘掉。这不是个人偏好——这能帮你避开一堆作用域和提升相关的 bug。
