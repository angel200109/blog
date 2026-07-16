# 判断两个对象是否"相等"，真没那么简单

```javascript
const a = { name: 'angel' };
const b = { name: 'angel' };
a === b; // false —— 好家伙
```

这大概是每个 JS 新手都会踩的坑。`===` 对于对象比较的是引用地址，而不是内容。那怎么比内容呢？

## `JSON.stringify` —— 简单粗暴但不够用

```javascript
const a = { name: 'angel', age: 18 };
const b = { name: 'angel', age: 18 };
JSON.stringify(a) === JSON.stringify(b); // true
```

大多数场景够用了，但有几个致命缺陷：

- **属性顺序不同会误判**：`{a:1, b:2}` 和 `{b:2, a:1}` 序列化后字符串不同
- **`undefined`、函数、Symbol 会被忽略或转成 `null`**
- **`NaN` 变成 `null`**
- **`Date` 变成字符串，`RegExp` 变成 `{}`**

所以 `JSON.stringify` 只适合比较结构简单的纯数据对象。遇到复杂对象或需要精确比较时别用。

## 手写浅比较（shallow compare）

```javascript
function shallowEqual(a, b) {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => a[key] === b[key]);
}
```

React 的 `PureComponent` 和 `React.memo` 内部就用类似逻辑做浅比较。只比第一层属性的引用，嵌套对象内部的变动检测不到。对大多数组件来说性能收益已经足够。

## 深比较

真要完整比较嵌套结构，就得递归了。可以自己写，也可以用成熟的库（比如 lodash 的 `_.isEqual`）。自己写要注意循环引用——`a.self = a` 这种会让递归死循环，需要加一个 `WeakMap` 来记录已访问对象。

## 总结

- 简单的纯数据对象 → `JSON.stringify`
- React 组件 props 比较 → 浅比较
- 复杂对象、需要精确 → `_.isEqual` 或手写递归
- 两个独立创建的对象永远不要用 `===` 比

没有银弹，看你比的是什么。
