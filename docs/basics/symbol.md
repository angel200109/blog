# Symbol：独一无二的值

ES6 引入的 `Symbol` 是原始类型中的一员，它的核心特征是**唯一性**——每次调用 `Symbol()` 都返回一个不可重复的值，即使传入相同的描述字符串。

### 唯一性

```js
const a = Symbol("desc");
const b = Symbol("desc");
console.log(a === b); // false —— 每次调用都是新的
```

描述字符串仅用于调试和日志输出，不影响值的相等性。`Symbol.for()` 是个例外——它在全局 Symbol 注册表中以字符串为键查找或创建 Symbol，两次 `Symbol.for("key")` 返回的是同一个值：

```js
const a = Symbol.for("app.key");
const b = Symbol.for("app.key");
console.log(a === b); // true
```

### 作为对象属性键

Symbol 最常见的用途是定义不会与其他属性键冲突的对象属性。这在三方库和框架中尤其有价值——避免对用户代码空间的侵入。

```js
const internalId = Symbol("id");

const user = {
  name: "Alice",
  [internalId]: "usr_001"
};

console.log(user[internalId]); // "usr_001"
```

### 不可枚举与隐藏特性

Symbol 属性不会出现在 `for...in` 循环中，也不会被 `Object.keys()` 和 `JSON.stringify()` 返回。这是有意设计——Symbol 属性默认被视为"内部"数据。

```js
const meta = Symbol("meta");
const record = {
  title: "Report",
  [meta]: { createdAt: "2024-01-01" }
};

Object.keys(record);           // ["title"]
JSON.stringify(record);        // '{"title":"Report"}'

// 获取 Symbol 属性需要专门的方法
Object.getOwnPropertySymbols(record); // [Symbol(meta)]
Reflect.ownKeys(record);              // ["title", Symbol(meta)]
```

### 作为常量

用 Symbol 定义常量可以保证值不被意外覆盖或冲突。相比用字符串 `"FETCHING"` 做状态值，Symbol 提供了更强的类型安全保障：

```js
const LoadingState = {
  IDLE: Symbol("idle"),
  FETCHING: Symbol("fetching"),
  SUCCESS: Symbol("success"),
  ERROR: Symbol("error")
};

let state = LoadingState.IDLE;
// 后续在 reducer 或条件判断中使用
```

### Symbol 不能隐式转换

与其他原始类型不同，Symbol 不能隐式转为字符串或数字。任何隐式转换尝试都会抛出 `TypeError`：

```js
const sym = Symbol("test");
"" + sym;           // TypeError
`${sym}`;           // TypeError
sym + 1;            // TypeError

// 只有显式转换允许
String(sym);        // "Symbol(test)"
sym.toString();     // "Symbol(test)"
sym.description;    // "test" —— 直接获取描述字符串
```

### 内置 Well-Known Symbol

ECMAScript 定义了一系列内置 Symbol，用于暴露和自定义语言的内部行为：

- `Symbol.iterator`：为对象定义默认迭代器，使其可被 `for...of` 遍历
- `Symbol.toPrimitive`：自定义对象到原始值的转换行为
- `Symbol.hasInstance`：自定义 `instanceof` 行为
- `Symbol.species`：指定衍生对象（如 `map()` 返回值）的构造函数

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    return {
      next: () => ({
        done: current > this.to,
        value: current++
      })
    };
  }
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```
