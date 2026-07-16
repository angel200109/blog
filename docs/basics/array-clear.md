# 清空数组的几种姿势，你用过几种？

清空数组这个操作看起来简单粗暴，但不同的写法背后牵涉到内存引用、性能、副作用，选错了可能带来意料之外的 bug。

## 直接赋值 `arr = []`

```javascript
let arr = [1, 2, 3, 4, 5];
arr = [];
```

最直觉的写法——把变量指向一个新空数组。**但问题是**：如果有其他变量也引用了原数组，它不受影响。旧数组并没有被清空，只是当前这个变量不再指向它了。

```javascript
let arr = [1, 2, 3];
let ref = arr;
arr = [];
console.log(ref); // [1, 2, 3] —— 还在呢
```

所以如果你的数组被多处引用，这种写法是"掩耳盗铃"。

## `arr.length = 0`

```javascript
let arr = [1, 2, 3, 4, 5];
arr.length = 0;
console.log(arr); // []
```

这招厉害了——原地清空，所有引用该数组的地方都同步清空。性能上也极好，是 O(1) 操作。大多数场景下这是最优解，一行搞定，副作用清晰。

## `arr.splice(0, arr.length)`

```javascript
let arr = [1, 2, 3, 4, 5];
arr.splice(0, arr.length);
```

同样是原地清空，原数组的所有引用都会同步。时间复杂度 O(n)，因为 splice 要逐个删除元素。和 `length = 0` 比没优势，但它胜在语义明确——"从第 0 个开始全删掉"。

## 循环 pop / shift

```javascript
// 尾部逐个删除
while (arr.length) { arr.pop(); }

// 头部逐个删除
while (arr.length) { arr.shift(); }
```

pop 循环是 O(n)，shift 循环是 O(n²)——因为每次 shift 后所有元素要往前挪一位。实际开发中几乎不这么写，但面试可能会问"shift 为什么比 pop 慢"，就是因为它要移动所有元素的索引。

## 总结

日常开发建议用 `arr.length = 0`，一行搞定、原地清空、性能最优。如果就是要"断开引用"、让旧数组被 GC 回收，那 `arr = []` 也没毛病。
