# const、let、var 该怎么选

### 作用域：函数 vs 块

`var` 是函数作用域——在函数内部声明的 `var` 变量在整个函数体内可见，不受 `{}` 块边界限制。`let` 和 `const` 是块级作用域——在 `{}` 内声明则只在该块内可见。

```js
function demo() {
  if (true) {
    var x = 1;
    let y = 2;
    const z = 3;
  }
  console.log(x); // 1 —— var 穿透了 if 块
  console.log(y); // ReferenceError —— let 受块限制
  console.log(z); // ReferenceError —— const 受块限制
}
```

这一差异在循环中尤为突出：`for` 循环用 `var` 声明的计数器会泄漏到循环外，且闭包捕获的是同一个变量；`let` 在每次迭代创建独立绑定，天然规避了闭包陷阱。

```js
// var：所有回调打印同一个值
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 输出：3, 3, 3

// let：每个回调捕获独立的 i
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 输出：0, 1, 2
```

### 提升行为：初始化与否

三种声明都会被引擎提升（hoisting）到作用域顶部，但只有 `var` 会被初始化为 `undefined`。`let` 和 `const` 在声明行之前处于**暂时性死区（TDZ）**，访问会抛出 `ReferenceError`。

```js
console.log(a); // undefined —— var 提升并初始化为 undefined
var a = 1;

console.log(b); // ReferenceError —— let 在 TDZ 中
let b = 2;
```

### 重复声明与赋值

`var` 允许在同一作用域内重复声明，后声明的会覆盖前者。`let` 和 `const` 禁止重复声明，在编译阶段就报 `SyntaxError`。

```js
var a = 1;
var a = 2; // 无报错

let b = 1;
let b = 2; // SyntaxError: Identifier 'b' has already been declared
```

`let` 可以分离声明和赋值；`const` 必须在声明时初始化，且之后不能重新赋值。但 `const` 声明的对象，其内部属性仍可修改——`const` 锁住的是引用本身，不是引用指向的内容。

```js
const config = { host: "localhost" };
config.port = 8080;   // 允许 —— 修改属性
config = {};          // TypeError —— 不能更换引用

const nums = [1, 2, 3];
nums.push(4);         // 允许
nums = [];            // TypeError
```

### 选择策略

默认使用 `const`——它向代码读者明确传达"此绑定不会变化"的意图。只有确认变量需要重新赋值时改用 `let`。`var` 在现代代码中几乎没有使用场景——它的函数作用域和重复声明特性增加了维护成本和潜在的 bug。
