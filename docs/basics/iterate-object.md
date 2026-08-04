# 遍历 JS 对象的四种方式

### for...in：自身 + 原型链的可枚举属性

```js
const user = {
  name: 'Alice',
  role: 'developer',
};

for (const key in user) {
  console.log(key, user[key]);
}
// name Alice
// role developer
```

`for...in` 会遍历对象自身及原型链上所有可枚举属性。这一特性在原型链有额外属性时会产生意外结果：

```js
const person = { species: 'human' };
const student = Object.create(person);
student.name = 'Bob';
student.grade = 'A';

for (const key in student) {
  console.log(key); // name, grade, species —— species 来自原型
}
```

如果只关心自身属性，需要在循环内部用 `hasOwnProperty` 过滤：

```js
for (const key in student) {
  if (Object.prototype.hasOwnProperty.call(student, key)) {
    console.log(key); // 只输出 name, grade
  }
}
```

调用 `Object.prototype.hasOwnProperty.call(obj, key)` 而非 `obj.hasOwnProperty(key)`，是因为对象可能通过 `Object.create(null)` 创建而没有继承该方法，也可能自身定义了同名的 `hasOwnProperty` 属性。

### Object.keys：自身可枚举属性的键

```js
const config = {
  host: 'localhost',
  port: 5432,
  database: 'app_db',
};

const keys = Object.keys(config);
// ['host', 'port', 'database']

keys.forEach(key => {
  console.log(key, config[key]);
});
```

`Object.keys` 只返回自身可枚举属性的键（不含 `Symbol` 键）。这是日常开发中最常用的遍历方式，不涉及原型链，行为可预期。

### Object.entries：自身可枚举属性的键值对

```js
const config = {
  host: 'localhost',
  port: 5432,
};

Object.entries(config);
// [['host', 'localhost'], ['port', 5432]]

// 解构遍历
for (const [key, value] of Object.entries(config)) {
  console.log(`${key}: ${value}`);
}
// host: localhost
// port: 5432
```

`Object.entries` 返回 `[key, value]` 对的数组，配合 `for...of` 和解构赋值使用时比 `Object.keys` 少一层取值操作。适用范围和 `Object.keys` 一致：自身可枚举属性。

### Reflect.ownKeys：最全面的遍历

```js
const sym = Symbol('internal');
const record = {
  id: 1,
  name: 'item',
  [sym]: 'secret',
};

Object.defineProperty(record, 'hidden', {
  value: 'invisible',
  enumerable: false,
});

Reflect.ownKeys(record);
// ['id', 'name', 'hidden', Symbol(internal)]
```

`Reflect.ownKeys` 返回所有自身属性键：字符串键 + `Symbol` 键，可枚举 + 不可枚举。返回顺序是：正整数键（升序）→ 字符串键（插入顺序）→ `Symbol` 键（插入顺序）。

### 方式对比

| 方法 | 自身属性 | 原型链 | 不可枚举 | Symbol 键 |
|------|---------|--------|---------|-----------|
| `for...in` | ✓ | ✓ | ✗ | ✗ |
| `Object.keys` | ✓ | ✗ | ✗ | ✗ |
| `Object.entries` | ✓ | ✗ | ✗ | ✗ |
| `Reflect.ownKeys` | ✓ | ✗ | ✓ | ✓ |

日常遍历用 `Object.keys` 或 `Object.entries`；需要同时访问键和值用 `Object.entries` 配合解构；需要包括不可枚举和 `Symbol` 属性时用 `Reflect.ownKeys`；`for...in` 除非刻意遍历原型链，否则不推荐直接用于对象遍历。
