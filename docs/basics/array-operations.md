# 一张图记住 JS 数组常用方法

JavaScript 数组的方法数量可观，但按"是否修改原数组"和"返回值类型"两个维度分类后，记忆负担会大幅降低。下面的分类体系覆盖了日常开发中最常用的操作。

### 遍历方法

```js
const scores = [85, 92, 78, 95, 88];

for (let i = 0; i < scores.length; i++) {
  // 索引遍历，性能最好
}

for (const key in scores) {
  // 遍历键名（索引），会遍历原型链属性，不推荐用于数组
}

for (const score of scores) {
  // 遍历值，最直观的现代写法
}

scores.forEach(score => {
  // 仅遍历，无返回值，无法中途 break
});
```

`for...in` 遍历的是可枚举属性键，包括原型链上的属性，不建议用于数组。`for...of` 和 `forEach` 是推荐方式，前者支持 `break`，后者语义更声明式。

### 增删方法（修改原数组）

```js
const tasks = ['代码审查', '编写文档'];

tasks.push('提交代码'); // 尾部添加，返回新长度
tasks.unshift('晨会'); // 头部添加，返回新长度
tasks.splice(2, 0, '午休'); // 从索引 2 开始，删 0 个，插入 '午休'

tasks.pop(); // 尾部删除，返回被删元素
tasks.shift(); // 头部删除，返回被删元素
tasks.splice(1, 2); // 从索引 1 开始，删 2 个，返回被删元素数组
```

`splice` 是很灵活的方法，插入和删除都通过它完成。`pop` 和 `push` 模拟栈行为，`shift` 和 `unshift` 模拟队列行为。

### 排序方法（修改原数组）

```js
const numbers = [3, 1, 4, 1, 5];
numbers.sort((a, b) => a - b); // 升序，原数组被修改
numbers.reverse(); // 反转，原数组被修改
```

`sort` 默认按字符串 Unicode 码点排序，数值排序必须传入比较函数。两个方法都返回排序后的原数组（不是新数组）。

### 返回新数组的方法

```js
const products = [
  { name: '机械键盘', price: 399 },
  { name: '显示器', price: 1299 },
  { name: '鼠标垫', price: 29 },
];

const topTwo = products.slice(0, 2); // 浅拷贝子数组

const onSale = products.filter(p => p.price < 400); // 过滤

const names = products.map(p => p.name); // 映射

const total = products.reduce((sum, p) => sum + p.price, 0); // 累加

const allCheap = products.every(p => p.price < 1500); // 全部满足 → true

const hasExpensive = products.some(p => p.price > 1000); // 任一满足 → true
```

`slice` 浅拷贝片段；`filter`/`map`/`reduce` 是函数式三件套；`every`/`some` 做断言判断。这些方法都不修改原数组。

### 查找方法

```js
const tags = ['JavaScript', 'TypeScript', 'React', 'Vue'];

tags.indexOf('React'); // 第一个匹配的索引：2
tags.lastIndexOf('React'); // 最后一个匹配的索引：2
tags.includes('Vue'); // 是否存在：true

tags.find(tag => tag.startsWith('J')); // 返回第一个匹配值：'JavaScript'
tags.findIndex(tag => tag.startsWith('V')); // 返回第一个匹配索引：3
```

`indexOf`/`includes` 使用严格相等比较（`===`），`find`/`findIndex` 使用回调函数判断，灵活性更高。`includes` 能正确处理 `NaN`（`indexOf` 不能）。

### 其他常用方法

```js
const paths = ['home', 'blog', 'article'];
paths.join('/'); // 'home/blog/article'

const arr = [1, 2, 3];
arr.concat([4, 5]); // [1, 2, 3, 4, 5]，返回新数组

const nested = [1, [2, [3, 4]]];
nested.flat(); // [1, 2, [3, 4]]，默认展平一层
nested.flat(2); // [1, 2, 3, 4]
nested.flat(Infinity); // [1, 2, 3, 4]，任意深度展平
```

`join` 将数组拼成字符串，`concat` 合并数组（返回新数组），`flat` 展平嵌套结构。`flat` 方法接收深度参数，`Infinity` 可以展平任意深度的嵌套。
