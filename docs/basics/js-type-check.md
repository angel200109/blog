# JavaScript 类型判断三剑客

JavaScript 的类型系统混合了原始类型和引用类型，单一方法无法覆盖所有判断场景。实际开发中需要组合 `typeof`、`instanceof` 和 `Object.prototype.toString.call()` 三者。

### typeof：快速区分原始类型

`typeof` 是编译时确定的运算符，执行开销极低，适合快速检测大多数原始类型。但有两个著名陷阱：`typeof null === "object"`（历史遗留），以及所有非函数引用类型统一返回 `"object"`。

```js
typeof 42;            // "number"
typeof "hello";       // "string"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof Symbol("id");  // "symbol"
typeof 100n;          // "bigint"
typeof null;          // "object" —— 陷阱
typeof {};            // "object"
typeof [];            // "object" —— 无法区分数组
typeof new Date();    // "object"
typeof function(){};  // "function" —— 函数是特例
```

`typeof` 对 `function` 返回 `"function"` 是 ECMAScript 规范专门定义的，并非 `function` 本身是独立类型——函数本质仍是对象。

### instanceof：沿原型链追溯

`instanceof` 检查构造函数的 `prototype` 是否出现在对象的原型链上。能区分数组、日期等内置类型，但无法判断原始类型。

```js
[] instanceof Array;            // true
new Date() instanceof Date;     // true
{} instanceof Object;           // true
function(){} instanceof Function; // true

42 instanceof Number;           // false —— 原始类型不在原型链上
"hello" instanceof String;      // false
```

跨窗口（iframe）场景是 `instanceof` 的边界条件：不同窗口各自拥有独立的内置构造函数，一个窗口的数组在另一个窗口的 `Array` 检测下会返回 `false`。

```js
// iframe 中的数组
iframeArray instanceof Array; // false
Array.isArray(iframeArray);   // true —— 不受窗口边界影响
```

### Object.prototype.toString.call()：最精确的通用方法

该方法利用 `Object.prototype` 上原始的 `toString` 读取内部 `[[Class]]` 标签，返回 `"[object Type]"` 格式的字符串。它几乎能区分所有内置类型。

```js
Object.prototype.toString.call(42);        // "[object Number]"
Object.prototype.toString.call("hello");   // "[object String]"
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call(new Date()); // "[object Date]"
Object.prototype.toString.call(null);      // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

原始类型之所以能通过这个方法得到类型标识，是因为调用前触发了**自动装箱**（autoboxing）：引擎临时将 `42` 包装为 `new Number(42)`，再由 `toString` 读取其内部类型标签。`.call()` 的作用是将 `this` 手动指向传入的值，绕过各子类重写的 `toString`。

### 方法对比速查

| 方法 | 原始类型 | 数组 | 日期 | null | 跨窗口 |
|------|---------|------|------|------|--------|
| `typeof` | ✅ 除 null | ❌ | ❌ | ❌ | ✅ |
| `instanceof` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `toString.call` | ✅ | ✅ | ✅ | ✅ | ✅ |

实际应用中通常组合使用：用 `typeof` 快速排除原始类型，再用 `instanceof` 或 `toString.call` 进一步区分具体引用类型。`Array.isArray()` 则是判断数组的专用 API，比 `instanceof` 更可靠。
