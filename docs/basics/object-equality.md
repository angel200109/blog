# 判断两个对象是否相等

判断两个变量是否引用同一对象比较简单——`===` 即可。但判断两个对象"内容是否一致"就没有那么直接了：对象是引用类型，`===` 比较的是内存地址，而不是内部属性值。

### === 比较的是引用，不是内容

```js
const userA = { name: 'Alice', role: 'admin' };
const userB = { name: 'Alice', role: 'admin' };

console.log(userA === userB); // false —— 两个独立对象，地址不同
console.log(userA === userA); // true —— 同一引用
```

### JSON.stringify：最简单但有限制

```js
const isEqual = JSON.stringify(objA) === JSON.stringify(objB);
```

这种方案能覆盖多数浅层比较场景，但有明显的局限性：

1. **属性顺序敏感**：`{ a: 1, b: 2 }` 和 `{ b: 2, a: 1 }` 在 JSON 字符串中顺序可能不同（大多数引擎按插入顺序输出，但规范不严格保证），导致误判。
2. **无法处理特殊值**：`undefined`、`Function`、`Symbol` 在序列化时会被忽略或转为 `null`，导致 `{ a: undefined }` 序列化后变成 `{}`。
3. **无法处理循环引用**：直接抛出 `TypeError`。
4. **特殊类型丢失**：`NaN` 变成 `null`，`Infinity` 变成 `null`。

以下情况会得到错误结果：

```js
const a = { value: NaN };
const b = { value: NaN };
JSON.stringify(a) === JSON.stringify(b); // true —— 但 NaN !== NaN

const c = { fn: () => {} };
const d = { fn: () => {} };
JSON.stringify(c) === JSON.stringify(d); // true —— 函数都被忽略了
```

### 浅比较（Shallow Comparison）

`Object.keys` 配合遍历可以做浅层属性对比：

```js
function shallowEqual(objA, objB) {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key =>
    Object.prototype.hasOwnProperty.call(objB, key) &&
    objA[key] === objB[key]
  );
}
```

这种方案只比较第一层属性的引用相等性，嵌套对象仍会被误判。React 函数组件中的 `React.memo` 默认使用的就是浅比较。

### 深比较（Deep Comparison）

深层比较需要递归处理嵌套对象：

```js
function deepEqual(a, b) {
  if (a === b) return true; // 同一引用或基本类型相等
  
  if (typeof a !== 'object' || typeof b !== 'object' ||
      a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key =>
    Object.prototype.hasOwnProperty.call(b, key) &&
    deepEqual(a[key], b[key])
  );
}
```

深比较需要额外处理 `Date`、`RegExp`、`Map`、`Set` 等特殊对象类型，以及循环引用。生产环境中，Lodash 的 `_.isEqual` 或类似工具函数已经覆盖了这些边界场景，不推荐自己从头实现。
