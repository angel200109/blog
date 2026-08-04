# 判断一个对象是不是空的

### Object.keys：检查自身可枚举属性

```js
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const profile = { name: 'Alice' };
isEmpty(profile); // false
isEmpty({}); // true
```

`Object.keys` 只返回对象自身的可枚举属性。这也是日常开发中最常用的空对象判断方式。

不过它有两个边界情况：

```js
// 不可枚举属性会被忽略
const config = {};
Object.defineProperty(config, 'mode', { value: 'strict', enumerable: false });
Object.keys(config).length === 0; // true —— 但对象实际上有属性

// 继承属性也会被忽略
const parent = { type: 'abstract' };
const child = Object.create(parent);
Object.keys(child).length === 0; // true
```

这种"不完整"多数情况下反而是期望的行为——判断空对象通常是为了确认"我有没有往这个对象上放过数据"，而不是关心原型链上存在什么。

### Object.getOwnPropertyNames：包含不可枚举属性

```js
const config = {};
Object.defineProperty(config, 'internalId', { value: 99, enumerable: false });

Object.getOwnPropertyNames(config).length === 0; // false
```

`Object.getOwnPropertyNames` 会返回所有自有属性键（不含 `Symbol`），无论是否可枚举。适用于需要检查"对象自身是否定义了任何属性"的场景。

### Reflect.ownKeys：最全面的检查

```js
const data = {};
const sym = Symbol('id');
data[sym] = 1;

Reflect.ownKeys(data).length === 0; // false
```

`Reflect.ownKeys` 返回对象的所有自身属性键，包括字符串键和 `Symbol` 键。如果业务代码使用了 `Symbol` 属性，这是最保险的判断方式。

### for...in：包含原型链

```js
function isEmpty(obj) {
  for (const key in obj) {
    return false;
  }
  return true;
}

const child = Object.create({ inherited: true });
isEmpty(child); // false —— 因为原型上的 inherited 被遍历到了
```

`for...in` 会遍历自身和原型链上的所有可枚举属性。判断空对象时几乎不推荐使用这个方式，除非刻意要检查整条原型链上是否有属性。

### JSON.stringify：不可靠的方式

```js
JSON.stringify({}) === '{}'; // true
JSON.stringify({ time: undefined }) === '{}'; // true —— 误判
```

`undefined` 和函数在 JSON 序列化中会被忽略，导致非空对象被误判为空。不推荐使用。

### 小结

| 方法 | 范围 | 适用场景 |
|------|------|---------|
| `Object.keys` | 自身可枚举 | 日常开发，最常用 |
| `Object.getOwnPropertyNames` | 自身所有（不含 Symbol） | 需要关注不可枚举属性 |
| `Reflect.ownKeys` | 自身所有（含 Symbol） | 最全面，适用于使用了 Symbol 的场景 |
| `for...in` | 自身 + 原型链可枚举 | 基本不用于空对象判断 |

除非使用了 `Symbol` 或 `Object.defineProperty` 定义不可枚举属性，否则 `Object.keys(obj).length === 0` 是兼顾简洁与可靠的选择。
