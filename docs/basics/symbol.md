# Symbol：JavaScript 里的"独一无二"

## 简介

`Symbol` 算是 ES6 里最容易被忽略的一个类型。它不像箭头函数、Promise 那样天天用，但它在特定场景下是不可替代的——比如不想让别人遍历到的私有属性。

## 核心概念

### 永远唯一的身份证

即使描述字符串一模一样，创建的每个 Symbol 都是独一无二的：

```javascript
const a = Symbol('red');
const b = Symbol('red');
console.log(a === b); // false
```

这跟字符串完全不同——`'red' === 'red'` 永远 true。Symbol 的核心价值就在这个"唯一性"上。

### 三大特性

**用作对象属性名：** 这是 Symbol 最主要的用途，避免属性名冲突。

```javascript
const password = Symbol('password');
const user = {
  name: 'angelina',
  [password]: 'abc123'
};
console.log(user[password]); // 'abc123'
```

**不可枚举：** Symbol 属性不会出现在 `for...in`、`Object.keys()` 中。但 `Object.getOwnPropertySymbols()` 和 `Reflect.ownKeys()` 能拿到。

```javascript
for (let key in user) {
  console.log(key); // 只输出 'name'，不输出 Symbol
}
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(password)]
```

**全局共享：** 通过 `Symbol.for()` 创建的 Symbol 会被注册到全局表中，同一个 key 拿到的是同一个 Symbol：

```javascript
const s1 = Symbol.for('app.id');
const s2 = Symbol.for('app.id');
console.log(s1 === s2); // true
```

## 实战场景

### 场景 1：隐藏内部状态

写个类，不想让使用者用 `for...in` 遍历到内部状态：

```javascript
const _state = Symbol('state');

class Store {
  constructor() {
    this[_state] = {};
  }

  get(key) {
    return this[_state][key];
  }

  set(key, value) {
    this[_state][key] = value;
  }
}

const store = new Store();
store.set('theme', 'dark');
console.log(Object.keys(store)); // []，干干净净
```

### 场景 2：定义常量防止值冲突

```javascript
const COLOR_RED = Symbol('red');
const COLOR_BLUE = Symbol('blue');

function paint(color) {
  switch (color) {
    case COLOR_RED: return '#ff0000';
    case COLOR_BLUE: return '#0000ff';
  }
}
```

## 总结

Symbol 解决的是"需要一个绝对不会和别人冲突的值"的问题。日常业务代码用得不多，但在写库、写框架、做底层抽象时很有用。
