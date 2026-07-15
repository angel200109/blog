# 数组去重的五种方式

## 简介

数组去重是前端面试和日常开发都绕不过的经典操作。方法很多，但各自的适用场景和性能差异不小，值得掰扯一下。

## 核心概念

### 方法一：Set（推荐首选）

ES6 的 `Set` 天生不接受重复值，一行搞定：

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(arr)];
// [1, 2, 3, 4, 5]
```

优点：代码短、性能好（O(n)）。缺点：不能去重对象，因为 `{a:1}` 和 `{a:1}` 在 Set 眼里是不同引用。

### 方法二：filter + indexOf

利用 `indexOf` 只返回第一个匹配的索引：

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = arr.filter((item, index) => arr.indexOf(item) === index);
```

思路简单，但 `indexOf` 在每次迭代都从头搜，性能 O(n²)。

### 方法三：reduce 构建新数组

逐个检查，不在结果数组里才加入：

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const unique = arr.reduce((acc, cur) => {
  if (!acc.includes(cur)) acc.push(cur);
  return acc;
}, []);
```

同样是 O(n²)，但写法函数式风格，适合 pipeline 链式操作。

### 方法四：forEach + indexOf

```javascript
const unique = [];
arr.forEach(val => {
  if (unique.indexOf(val) === -1) unique.push(val);
});
```

和第 3 种本质上一样，换了个循环写法。

### 方法五：forEach + includes

```javascript
const unique = [];
arr.forEach(val => {
  if (!unique.includes(val)) unique.push(val);
});
```

`includes` 比 `indexOf` 语义更清晰，能正确处理 `NaN`（`indexOf` 找不到 `NaN`）。

## 实战场景

大多数情况**直接用 Set**就够了。但如果数组里是对象，需要按某个字段去重，Set 就不好使了：

```javascript
const users = [
  { id: 1, name: 'angelina' },
  { id: 2, name: 'tom' },
  { id: 1, name: 'angelina-dup' }
];

// 按 id 去重
const seen = new Map();
const unique = users.filter(u => !seen.has(u.id) && seen.set(u.id, true));
```

## 总结

- 原始值数组 → `[...new Set(arr)]`
- 对象数组按字段去重 → Map + filter
- 面试要你写多种方式 → 上面五种挨个背
