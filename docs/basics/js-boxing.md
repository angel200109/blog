# JS 装箱机制

JavaScript 的原始类型（`number`、`string`、`boolean` 等）本身不是对象，不能挂载方法。但开发者可以像这样写：

```js
"hello".toUpperCase();  // "HELLO"
42..toFixed(2);         // "42.00"
```

这能正常执行，是因为引擎在背后执行了**自动装箱（Autoboxing）**——当原始值尝试访问属性或方法时，引擎临时创建一个对应的包装对象，在对象上执行操作后立即丢弃。

### 装箱的触发与瞬间

装箱的触发条件是原始类型出现在属性访问的上下文中（通过 `.` 或 `[]` 操作符）。引擎执行的等价逻辑：

```js
// 开发者写的代码
"hello".toUpperCase();

// 引擎实际做的事
const temp = new String("hello");
const result = temp.toUpperCase();
// temp 被销毁
```

包装对象只在那一瞬间存在，操作完成后立即被回收。因此无法给原始类型"持久地"挂载属性：

```js
const str = "hello";
str.customProp = 42;
console.log(str.customProp); // undefined —— 第二次访问时，包装对象已是新创建的
```

### 装箱在类型检测中的体现

装箱解释了 `Object.prototype.toString.call()` 的一个微妙行为：

```js
Object.prototype.toString.call(42);        // "[object Number]"
Object.prototype.toString.call("hello");   // "[object String]"
```

原始值 `42` 在传入时会触发装箱，`toString` 读取的是包装对象 `Number` 的内部 `[[Class]]` 标签。由于装箱后的对象和 `new Number(42)` 创建的包装对象共享同一套类型标识，仅靠 `toString.call` 无法区分两者：

```js
const primitive = 42;
const boxed = new Number(42);

Object.prototype.toString.call(primitive); // "[object Number]"
Object.prototype.toString.call(boxed);     // "[object Number]" —— 相同

typeof primitive;   // "number"
typeof boxed;       // "object"
primitive instanceof Number;  // false —— 未触发装箱
boxed instanceof Number;      // true
```

区分两者需要用 `typeof` 或 `instanceof` 联合判断。

### 包装对象类型的特殊行为

`Boolean` 包装对象有一个反直觉的特性：任何包装对象求值都是 `true`，包括包裹了 `false` 的。

```js
const wrappedFalse = new Boolean(false);
if (wrappedFalse) {
  console.log("进入"); // 会执行 —— 对象永远为真
}
```

这是将原始类型与包装对象混用时最常见的陷阱之一。ESLint 规则 `no-new-wrappers` 专门禁止 `new String()`、`new Number()`、`new Boolean()` 的用法——在实际开发中几乎没有需要显式创建包装对象的场景。
