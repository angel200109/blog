# 一个 reduce 搞定数组五连问

`reduce` 是数组方法中表达能力最强的——它能实现 `map`、`filter`、`find` 等方法的任何逻辑，本质是把数组"归约"成一个值。`reduce` 接收两个参数：一个回调函数 `(accumulator, currentValue) => {}` 和一个初始值。回调会在每一轮迭代中接收累积结果和当前元素，返回新的累积结果。

### 累加求和

```js
const scores = [85, 92, 78, 95, 88];
const total = scores.reduce((sum, score) => sum + score, 0);
// total: 438
```

累计值 `sum` 从初始值 0 开始，每一轮加上当前分数，最终得到总和。这是 `reduce` 最直观的应用。

### 数组最大值

```js
const scores = [85, 92, 78, 95, 88];
const highest = scores.reduce((max, score) => Math.max(max, score));
// highest: 95
```

当不传初始值时，`reduce` 会用数组的第一个元素作为初始累积值，从第二个元素开始迭代。

### 数组去重

```js
const ids = [101, 203, 101, 405, 203];
const unique = ids.reduce((list, id) => {
  if (!list.includes(id)) {
    list.push(id);
  }
  return list;
}, []);
// unique: [101, 203, 405]
```

累积值是一个数组，初始为空。对每个元素检查是否已存在于累积数组中，不存在则加入。与 `new Set` 方案相比，这种方式更灵活——可以在去重过程中附加条件判断或转换逻辑。

### 字符串反转

```js
const username = 'developer';
const reversed = Array.from(username).reduce((acc, char) => char + acc, '');
// reversed: 'repoleved'
```

将字符串转为字符数组，累积值初始为空字符串。每一轮把当前字符放到已有字符的前面，实现反转。

### 按属性归类

```js
const developers = [
  { name: 'Alice', team: 'Frontend' },
  { name: 'Bob', team: 'Backend' },
  { name: 'Carol', team: 'Frontend' },
  { name: 'Dave', team: 'Backend' },
  { name: 'Eve', team: 'Platform' },
];

const grouped = developers.reduce((teams, dev) => {
  const { team } = dev;
  if (!teams[team]) {
    teams[team] = [];
  }
  teams[team].push(dev);
  return teams;
}, {});
// grouped: {
//   Frontend: [{ name: 'Alice', ... }, { name: 'Carol', ... }],
//   Backend: [{ name: 'Bob', ... }, { name: 'Dave', ... }],
//   Platform: [{ name: 'Eve', ... }]
// }
```

累积值初始为空对象。对数组中的每个开发者，取出其团队名作为键，在累积对象中检查该键是否存在——不存在则初始化为空数组——然后将当前开发者推入对应数组。

### reduce 的常见误区

不传初始值时，第一轮迭代的 `accumulator` 是数组的第一个元素，`currentValue` 是第二个元素。以下写法会得到错误结果：

```js
[].reduce((sum, n) => sum + n); // TypeError: Reduce of empty array with no initial value
```

当数组可能为空时，始终传入初始值是个稳妥习惯。另外，`reduce` 的回调中修改累积值后必须显式 `return`，否则下一轮迭代的累积值会是 `undefined`。
