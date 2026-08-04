# 伪数组不是数组，但也别慌

在 JavaScript 中，有些对象长得像数组——有数字索引和 `length` 属性——但没有继承 `Array.prototype`，因此无法使用 `push`、`forEach`、`map` 等数组方法。这类对象就是"类数组"（Array-like Object），也叫"伪数组"。

### 两种常见的类数组

#### `arguments` 对象

在非箭头函数内部，`arguments` 是一个类数组对象，包含了调用时传入的所有实参：

```js
function sum() {
  console.log(arguments[0]); // 第一个参数
  console.log(arguments.length); // 参数个数

  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

sum(10, 20, 30); // 60
```

`arguments` 支持索引访问和 `length` 属性，也可以用 `for` 循环遍历。但它不具备数组方法——`arguments.forEach()` 会直接报错。

注意：箭头函数没有自己的 `arguments` 对象；在箭头函数内访问 `arguments`，实际上访问的是外层函数的 `arguments`。

#### DOM 集合（NodeList / HTMLCollection）

通过 DOM API 获取的元素集合也是类数组：

```js
const divs = document.querySelectorAll('div');
console.log(divs[0]); // 第一个匹配的 <div>
console.log(divs.length); // 匹配数量
```

`NodeList` 有索引和 `length`，但原型链上依然是 `NodeList.prototype`，不是 `Array.prototype`。不过较新的浏览器已为 `NodeList` 添加了 `forEach` 方法（属于 `NodeList.prototype`，不是继承自 `Array`），`map`、`filter` 等仍然不可用。

### 转为真正的数组

`Array.from()` 是将类数组转为数组的标准方法：

```js
// 将 arguments 转为数组
function formatParams() {
  const args = Array.from(arguments);
  return args.map(item => `[${item}]`).join(', ');
}

formatParams('a', 'b', 'c'); // '[a], [b], [c]'
```

```js
// 将 NodeList 转为数组
const sectionEls = document.querySelectorAll('section');
Array.from(sectionEls).filter(el => el.classList.contains('active'));
```

`Array.from()` 还可以同时执行映射转换：

```js
Array.from(arguments, (val, idx) => `${idx}: ${val}`);
// 等价于 Array.from(arguments).map(...)，但更简洁
```

ES6 的展开运算符也能完成转换，但要求对象本身是可迭代的（实现了 `Symbol.iterator`）。`arguments` 和 `NodeList` 都是可迭代的，所以展开运算符也可以用：

```js
const args = [...arguments];
const divs = [...document.querySelectorAll('div')];
```

两者在此场景下等价，`Array.from()` 的适用面更广——它同样可以处理不可迭代的纯类数组对象。
