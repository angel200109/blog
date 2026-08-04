# Symbol：JavaScript 里的"独一无二"


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

