# 一张图记住 JS 数组常用方法

数组方法多到记不住？每次都要去 MDN 翻？其实只要记住"增删改查"四个字，再加上遍历和排序，90% 的场景都覆盖了。

## 遍历

```javascript
for (let i = 0; i < arr.length; ++i) {}  // 性能最好，经典写法
for (const key in arr) {}                // 遍历索引，不推荐用于数组
for (const item of arr) {}              // 遍历元素，最直观
arr.forEach(item => {});                // 仅遍历，不能 break
```

`for...of` 是最舒服的遍历方式，不用担心索引越界。`forEach` 方便但没法中途 `break`，要注意。`for...in` 是给对象设计的，遍历数组会带上原型链属性，别用。

## 增删（原地操作）

```javascript
arr.push(4)        // 尾加
arr.unshift(4)     // 头加
arr.splice(2, 0, 4)// 在索引 2 插入 4
arr.pop()          // 尾删
arr.shift()        // 头删
arr.splice(1, 2)   // 从索引 1 开始删 2 个
```

记住 push/pop 是尾部操作，复杂度 O(1)；unshift/shift 是头部操作，复杂度 O(n)。splice 是个万能选手，增删改全能，但性能一般。

## 返回新数组（不修改原数组）

```javascript
arr.slice(0, 2)
arr.filter(item => item > 0)
arr.map(item => item * 2)
arr.concat([4, 5])
arr.flat()            // 打平嵌套数组
```

这些方法不会动原数组，符合函数式编程的习惯。`map` 和 `filter` 是最常用的两个，`flat` 处理嵌套数组很方便——默认只打平一层，传 `Infinity` 可以全部打平。

## 查找

```javascript
arr.indexOf(3)       // 返回索引，找不到返回 -1
arr.lastIndexOf(3)   // 从后往前找
arr.includes(3)      // 返回 true/false，最直观
arr.find(item => item > 2)      // 返回第一个匹配的元素
arr.findIndex(item => item > 2) // 返回第一个匹配的索引
```

日常判断"数组里有没有某个值"用 `includes` 就够了，语义清晰。`find` 适合根据条件找对象。

## 其他常用

```javascript
arr.join('-')       // [1,2,3] → "1-2-3"
arr.every(item => item > 0)  // 全部满足 → true
arr.some(item => item > 0)   // 有一个满足 → true
arr.reduce((acc, cur) => acc + cur, 0)  // 累加
arr.sort((a, b) => a - b)    // 排序，注意默认按字符串排！
arr.reverse()                 // 反转
```

`sort()` 有个经典坑——默认按字符串排序，`[1, 11, 2]` 会排成 `[1, 11, 2]`，必须传比较函数。

## 小结

收藏这张"小抄"，写代码时心里有个地图就行，不用死记硬背。关键是知道什么时候用哪个、哪些改原数组、哪些不改。
