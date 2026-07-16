# 怎么区分数组和对象？`typeof` 不顶用

面试问"怎么判断一个变量是数组"，有人上来就说 `typeof`——不行。`typeof []` 的结果是 `"object"`，和 `typeof {}` 一模一样。

## 方法 1：`Array.isArray()`

```javascript
Array.isArray([]);   // true
Array.isArray({});   // false
```

ES5 引入的官方方案，最推荐。不存在跨 iframe 的问题，语义明确。

## 方法 2：`instanceof`

```javascript
[] instanceof Array;   // true
{} instanceof Array;   // false
```

大部分场景没问题，但有坑：如果数组来自另一个 iframe 或 window，它的 `Array` 构造函数和当前环境不是同一个，`instanceof` 会返回 `false`。这就是为什么 `Array.isArray()` 更靠谱。

## 方法 3：`Object.prototype.toString.call()`

```javascript
Object.prototype.toString.call([]);   // "[object Array]"
Object.prototype.toString.call({});   // "[object Object]"
```

这个方法能精确区分各种内置类型，包括 `Date`、`RegExp` 等。它是通过读取内部 `[[Class]]` 属性来判断的，不受跨环境影响。兼容性也最好，IE 都支持。

## 方法 4：检查 `constructor`

```javascript
[].constructor === Array;   // true
{}.constructor === Object;  // true
```

不推荐。`constructor` 可以被篡改，而且同样有跨 iframe 的问题。

## 到底用哪个

日常开发中 `Array.isArray()` 是标准答案。如果你在写工具库需要兼容极端情况，`Object.prototype.toString.call()` 是最稳的兜底方案。`typeof` 只适用于区分基本类型，引用类型一律返回 `"object"`（`typeof null` 也是 `"object"`，这是个著名的历史 bug）。
