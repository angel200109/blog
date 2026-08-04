# 变量提升与暂时性死区

变量提升（Hoisting）是 JavaScript 在执行代码前，将变量和函数声明"移动"到作用域顶部的编译阶段行为。理解提升的实质不是了解一道面试题的答案，而是理解为什么某些代码在声明前访问变量不报错，而另一些会。

### 提升的本质：编译阶段的预处理

JavaScript 引擎在真正执行代码之前，先进行一次"编译"扫描，收集所有 `var`、`let`、`const` 和函数声明，并在对应的词法环境中预留空间。具体的处理方式取决于声明类型：

- **`var`**：预留空间并初始化为 `undefined`
- **`let` / `const`**：预留空间但不初始化，标记为"未初始化"状态
- **函数声明**：整个函数体都被提升（不同于函数表达式的提升行为）

```js
console.log(x); // undefined —— var 提升并初始化
var x = 5;

sayHello();     // "Hello" —— 函数声明整体提升
function sayHello() {
  console.log("Hello");
}
```

### 函数提升的优先级

函数提升的优先级高于变量提升。当同名的函数声明和 `var` 声明同时存在时，函数声明会"胜出"：

```js
console.log(typeof foo); // "function"

var foo = 42;
function foo() {}
```

这并不意味着 `var foo` 消失了——它仍然存在，但在编译阶段，函数声明的绑定覆盖了 `var` 的绑定。当执行到 `var foo = 42` 这一行时，赋值操作会将 `foo` 从函数重写为数字。

### 暂时性死区（TDZ）

`let` 和 `const` 声明的变量从块顶部到声明行之间的区域称为**暂时性死区**（Temporal Dead Zone）。在这段区域内，变量已存在于词法环境中但处于未初始化状态，任何访问都会抛出 `ReferenceError`。

```js
{
  // TDZ 开始
  console.log(typeof value); // ReferenceError —— 对 TDZ 内的变量使用 typeof 也不安全
  let value = 42;            // TDZ 结束
}
```

一个反直觉的情况是：对未声明的变量使用 `typeof` 返回 `"undefined"`，但对 TDZ 内的变量使用 `typeof` 却抛出错误——这意味着 `typeof` 不再是绝对安全的操作。

```js
console.log(typeof undefinedVar); // "undefined" —— 变量完全未声明

{
  console.log(typeof blocked);    // ReferenceError —— 在 TDZ 中
  let blocked;
}
```

### TDZ 的存在原因

TDZ 不是设计缺陷，而是有意引入的约束。`var` 的提升 + 初始化为 `undefined` 行为导致了一个常见的 bug：在声明前使用变量，得到一个意料之外的 `undefined` 而不是报错，问题被静默掩盖。TDZ 将这类错误从"静默失败"升级为"立即抛出异常"，帮助开发者在开发阶段就暴露问题。

```js
// var：静默返回 undefined，bug 隐蔽
function getTotal() {
  total = price * quantity;
  // ... 很多行代码之后
  var total, price = 100, quantity = 2;
  return total; // NaN —— 因为 price 声明在 total 之后，赋值也未执行
}

// let：直接报错，问题立现
function getTotal() {
  total = price * quantity; // ReferenceError
  let total, price = 100, quantity = 2;
}
```

### `function` 声明的块级作用域行为

在 ES6 之前，函数声明只能在全局作用域或函数作用域中出现。ES6 允许在块级作用域中声明函数，但其行为在不同环境下有细微差异：

```js
{
  function inner() { return "inside"; }
}
console.log(typeof inner); // 在严格模式下：undefined；部分环境下："function"
```

严格模式下的行为是规范的，但非严格模式下浏览器实现存在历史兼容差异。推荐在块级作用域中使用函数表达式而非函数声明。
