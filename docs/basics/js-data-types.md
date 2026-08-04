# JavaScript 数据类型全解

JavaScript 的类型系统分为**原始类型（Primitive）**和**引用类型（Reference）**两大类，理解它们的存储差异和运行时行为是编写可靠代码的前提。

### 七种原始类型与一种复杂类型

原始类型包括 `Number`、`String`、`Boolean`、`null`、`undefined`、ES6 引入的 `Symbol` 和 ES11 引入的 `BigInt`。引用类型统称为 `Object`，包含了普通对象、数组、函数、日期等一切"非原始类型"的实体。

`Number` 使用 IEEE 754 双精度浮点数，能安全表示的整数范围是 `-(2^53 - 1)` 到 `2^53 - 1`。超出这个范围就需要 `BigInt`——在数字末尾加 `n` 来声明，比如 `9007199254740992n`。

`Symbol` 的核心特征是唯一性：即使传入相同的描述字符串，每次调用 `Symbol("desc")` 返回的值也不相等。这使其适合用作对象中需要绝对不冲突的属性键。

`null` 和 `undefined` 虽然都表示"空"，但含义完全不同——`undefined` 是引擎在变量声明但未赋值时自动填充的默认值，而 `null` 是开发者主动写入的空值指针。

### 栈与堆：两种存储策略

原始类型存储在**栈（Stack）**中，复制时直接拷贝值；引用类型的数据实体存储在**堆（Heap）**中，栈中只保存指向堆地址的引用指针。这意味着将一个对象赋值给另一个变量时，拷贝的是引用而不是数据本身。

这种分离设计的动机很直接：原始类型大小固定、访问频繁，适合放在栈中快速读写；引用类型大小不确定（对象可以随时增删属性），放在堆中可以灵活扩展，栈只持有一个固定大小的指针。

```js
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 —— 原始类型是独立拷贝

const obj1 = { value: 10 };
const obj2 = obj1;
obj2.value = 20;
console.log(obj1.value); // 20 —— 引用类型共享同一份数据
```

### BigInt 的边界与限制

`BigInt` 不能和 `Number` 直接混合运算——`1n + 1` 会抛出 `TypeError`。涉及两者时需要显式转换：

```js
const big = 100n;
const num = 50;
console.log(big + BigInt(num)); // 150n
console.log(Number(big) + num); // 150，但可能丢失精度
```

`Math` 对象上的方法（如 `Math.max`、`Math.pow`）也不接受 `BigInt` 参数。`BigInt` 之间的除法会直接截断小数部分：`5n / 2n` 结果是 `2n`，不是 `2.5n`。
