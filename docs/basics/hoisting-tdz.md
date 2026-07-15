# 变量提升与暂时性死区

## 简介

"为什么在声明之前访问 `let` 变量会报错，`var` 却是 `undefined`？"——这题几乎每次面试都会变着花样出。答案藏在变量提升和暂时性死区这两个概念里。

## 核心概念

### 变量提升：代码还没跑到声明，声明已经上去了

JS 引擎在执行代码前会先扫描一遍，把所有的变量声明（`var`、`let`、`const`、`function`）"提升"到作用域顶部。

区别在于初始值：

- `var` 提升后初始化为 `undefined`
- `let` 和 `const` 提升后不初始化，处于"未初始化"状态
- `function` 声明整体提升，可以直接调用

```javascript
console.log(a); // undefined ← var 提升并初始化为 undefined
var a = 10;

console.log(b); // ReferenceError ← let 提升了但没初始化
let b = 20;
```

### 暂时性死区（TDZ）

从块作用域开始到 `let`/`const` 声明语句之间的区域，就叫暂时性死区。在这段区域里访问变量会直接抛出 ReferenceError，而不是返回 `undefined`。

```javascript
{
  // TDZ 开始
  console.log(x); // ReferenceError!
  let x = 3;      // TDZ 结束
}
```

为什么设计成这样？因为 `undefined` 是"有意的空值"，而"还没声明"和"声明了没赋值"是两件完全不同的事。TDZ 让你没声明之前碰都碰不到这个变量，避免了用 `undefined` 来糊弄过去的情况。

### 函数提升 vs 变量提升

函数声明会被整体提升，优先级还比 `var` 高：

```javascript
console.log(fn); // [Function: fn]
var fn = 123;
function fn() {}
// 但是：函数表达式用 var/let 声明，只有变量名被提升，函数体不会
```

## 实战场景

实际开发中 TDZ 最常踩的坑：

```javascript
// 不好的写法
function getData() {
  if (!cache) {
    const cache = fetchCache();
  }
  return cache; // ReferenceError: cache 在 TDZ 中
}

// 好的写法
function getData() {
  const cache = fetchCache();
  if (!cache) {
    return null;
  }
  return cache;
}
```

还有 `typeof` 的安全假象——`typeof` 对未声明的变量不会报错：

```javascript
typeof notDeclared; // "undefined"，不报错
typeof x;           // ReferenceError！因为 let x 在 TDZ 里
let x;
```

## 总结

`var` 提升并初始化为 `undefined`，`let`/`const` 提升但不初始化 = 暂时性死区。TDZ 的存在让你没声明就不能用，这是好事——它逼你把变量声明放在正确的位置。
