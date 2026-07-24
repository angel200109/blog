# ES 每个版本引入了什么内容

## 简介

ES5、ES6、ES2016……每年 TC39 都往 JavaScript 里塞新东西。记住每个版本加了什么，面试经常考，平时看源码也能更快理解别人用了什么新语法。

## 核心概念

### ES5 (2009)

严格模式 `"use strict"` 是这版加的，还有 `Object.defineProperty`、`Array.prototype.forEach/map/filter/reduce`、`JSON.parse/stringify`。基本上就是让 JS 从不正经变得稍微正经了点。

### ES6 / ES2015

这是 JavaScript 历史上最大的一次更新，几乎重新定义了这门语言：

- `let`、`const`（块级作用域）
- 箭头函数 `() => {}`
- 模板字符串 `\`hello ${name}\``
- 解构赋值 `const { a, b } = obj`
- Promise、`class`、`import/export` 模块
- `Map`、`Set`、`Symbol`、`for...of`
- 展开运算符 `...`、默认参数

基本上现在写 JS 绕不开的东西，全是 ES6 的。

### ES2017

`async/await` 登场，Promise 链终于不用写得跟面条似的了。`Object.values/entries` 也在这版。

### ES2018

`Promise.finally`、异步迭代 `for-await-of`、对象展开运算符 `{...obj}`。

### ES2020

可选链 `?.` 和空值合并 `??`——这两个简直救了多少人于 `Cannot read property of undefined` 的水深火热之中。还有 BigInt、`Promise.allSettled`。

### ES2021+

逻辑赋值 `||=` `&&=` `??=`、`replaceAll`、`at()`（负数索引）。后面每年的更新都比较小，这里不展开了。

## 实战场景

面试最常问的两个问题："ES6 有哪些新特性"和"可选链和空值合并怎么用"。日常开发中 `?.` 和 `??` 基本天天用，写出来的代码短了一截还不容易崩。

## 总结

ES6 是分水岭，后面每年小步快跑。面试前把 ES6 的几个大特性捋一遍就行。
