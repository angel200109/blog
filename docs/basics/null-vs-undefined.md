# null 和 undefined 的区别

### 语义差异

`undefined` 是 JavaScript 引擎的默认空值。变量声明后未赋值，引擎自动将其初始化为 `undefined`；函数没有 `return` 语句时，隐式返回 `undefined`；访问对象上不存在的属性，得到的也是 `undefined`。它是系统级的"此处尚未安排"标记。

`null` 则是开发者主动写入的值，表达"此处有意留空"。一个典型的场景是：清空一个对象引用时赋值为 `null`，而不是删除它或置为 `undefined`，以此明确告诉后续读者"这是设计意图，不是疏忽"。

### 类型检测的差异

```js
typeof undefined; // "undefined"
typeof null;      // "object"
```

`typeof null === "object"` 是 JavaScript 著名的历史遗留问题。在 JavaScript 的第一个版本中，值的类型信息以 32 位二进制标记存储，对象类型用低位 `000` 标记，而 `null` 的机器码恰好是全零——于是被错误地识别为 object。这个问题已写入 ECMAScript 规范，无法修复，因为大量代码依赖这一行为。

### 相等性比较

```js
null == undefined;   // true
null === undefined;  // false
```

宽松相等 `==` 将两者视为等价——这是 ECMAScript 规范明确规定的特例，不触发类型转换流程。严格相等 `===` 将它们区分为不同类型。

### 实际使用场景

**触发 `undefined` 的常见情况：**

- 已声明但未赋值的变量
- 函数没有返回值
- 调用函数时未传入的参数，对应形参在函数内部为 `undefined`
- 访问对象不存在的属性
- `void` 运算符的返回值（`void 0` 始终返回 `undefined`）

**适合使用 `null` 的场景：**

- 显式清空一个对象引用，便于垃圾回收
- 作为函数参数的默认空值，区分"未传"（`undefined`）和"传了空"（`null`）
- 原型链的终点：`Object.prototype.__proto__ === null`

```js
function getUser(id) {
  if (id === null) {
    return; // 调用方传了 null，表示"不查"
  }
  if (id === undefined) {
    return; // 调用方没传参数
  }
  // 正常查询逻辑
}
```

这个例子展示了区分两者的典型收益：调用方可以通过不传参数和传入 `null` 表达两种不同意图。
