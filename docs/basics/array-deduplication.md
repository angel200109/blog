# 数组去重的五种方式

### 方法一：Set + 展开运算符

`Set` 只允许存储唯一值，是去重的首选方案。一行代码即可完成，且对于基本类型值有非常好的可读性。

```js
const list = [8, 1, 1, 2, 3, 4, 5, 7, 7, 6];
const uniqueList = [...new Set(list)];
// [8, 1, 2, 3, 4, 5, 7, 6]
```

时间复杂度 O(n)。但 `Set` 基于 `SameValueZero` 算法比较：`NaN` 会被去重（同一 `NaN` 只保留一个），而 `{} !== {}` 所以对象不会被去重——实际上对象数组中每个对象的引用不同，`Set` 不会视其为重复。

### 方法二：filter + indexOf

利用 `filter` 遍历原数组，只保留第一次出现的元素——`indexOf` 返回的索引等于当前索引时说明该元素是首次出现。

```js
const list = [8, 1, 1, 2, 3, 4, 5, 7, 7, 6];
const uniqueList = list.filter((item, index) => {
  return list.indexOf(item) === index;
});
```

时间复杂度 O(n²)，因为 `indexOf` 本身是 O(n) 的遍历。对于几千项以内的数组通常可接受，但数据量更大时应优先使用 `Set` 方案。

### 方法三：reduce 累积

`reduce` 逐个检查当前元素是否已在累积数组中，只在不存在时追加。

```js
const list = [8, 1, 1, 2, 3, 4, 5, 7, 7, 6];
const uniqueList = list.reduce((accumulator, current) => {
  if (!accumulator.includes(current)) {
    accumulator.push(current);
  }
  return accumulator;
}, []);
```

时间复杂度 O(n²)，优势在于逻辑清晰且有扩展空间——在 `includes` 处可以替换为自定义比较逻辑。

### 方法四：forEach + indexOf

逐一遍历，只在目标数组中不存在当前值时推入。

```js
const list = [1, 2, 2, 3, 4, 4, 5];
const uniqueList = [];
list.forEach((value) => {
  if (uniqueList.indexOf(value) === -1) {
    uniqueList.push(value);
  }
});
```

### 方法五：forEach + includes

与方法四逻辑相同，将 `indexOf === -1` 替换为 `!includes()`，语义更直观。

```js
const list = [1, 2, 2, 3, 4, 4, 5];
const uniqueList = [];
list.forEach((value) => {
  if (!uniqueList.includes(value)) {
    uniqueList.push(value);
  }
});
```

### 方法对比

| 方法 | 时间复杂度 | 代码简洁度 | 适用场景 |
|------|-----------|-----------|---------|
| `Set` + 展开 | O(n) | ⭐⭐⭐⭐⭐ | 基本类型数组，首选方案 |
| `filter + indexOf` | O(n²) | ⭐⭐⭐⭐ | 中小型数组，无兼容性问题 |
| `reduce` | O(n²) | ⭐⭐⭐ | 需要在去重逻辑中插入自定义步骤 |
| `forEach + indexOf/includes` | O(n²) | ⭐⭐⭐ | 追求明确步骤控制的场景 |

对于面试场景，熟悉多种实现方式并理解各自的复杂度特征是核心考察点；对于生产代码，直接用 `Set` 即可。
