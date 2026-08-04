# 数组去重的五种方式


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

