# 怎么区分数组和对象

`typeof` 运算符在数组身上会返回 `"object"`，因为数组本质上也是对象。要精确区分一个值到底是普通对象还是数组，需要借助其他手段。

### Array.isArray：最可靠的方式

```js
const list = [1, 2, 3];
const data = { name: 'Alice' };

Array.isArray(list); // true
Array.isArray(data); // false
```

`Array.isArray` 是 ES5 引入的静态方法，检测的是内部 `[[Class]]` 属性，不受跨执行环境影响。在多个 `iframe` 或 `window` 之间传递数组时，它依然能正确判断。

### instanceof 及其局限

```js
const list = [1, 2, 3];
console.log(list instanceof Array); // true
```

`instanceof` 检查原型链上是否存在 `Array.prototype`。在单窗口场景下工作正常，但在跨 `iframe` 或跨 `window` 时会失效——每个执行上下文有自己独立的 `Array` 构造函数：

```js
// iframe 中的数组
const iframeArray = iframe.contentWindow.document.body.children;
console.log(iframeArray instanceof Array); // false
```

跨窗口传来的数组，其原型链指向的是来源窗口的 `Array.prototype`，而当前窗口的 `Array` 并不在其原型链上，所以 `instanceof` 会返回 `false`。

### 检查构造函数

```js
const list = [1, 2, 3];
console.log(list.constructor === Array); // true
```

通过 `constructor` 属性判断，本质与 `instanceof` 相同，同样受跨执行环境限制。而且 `constructor` 可以被改写，不够可靠。

### Object.prototype.toString：最通用

```js
const typeTag = Object.prototype.toString.call(list);
console.log(typeTag); // '[object Array]'

const isArray = typeTag === '[object Array]';
```

`Object.prototype.toString` 读取对象的内部 `[[Class]]` 值，`Array.isArray` 的内部实现就是基于这一机制。这种方式判断的是原始的内部类型标签，不受原型链篡改或跨窗口的影响。

### 小结

| 方法 | 可靠性 | 跨窗口 | 注意事项 |
|------|--------|--------|---------|
| `Array.isArray` | 最高 | 支持 | 首选方案 |
| `instanceof Array` | 中 | 不支持 | 原型链可被改写 |
| `constructor === Array` | 中 | 不支持 | 构造函数可被改写 |
| `Object.prototype.toString` | 高 | 支持 | 略繁琐 |

日常开发中优先使用 `Array.isArray`。如果运行环境需要兼容 IE8 及以下（不支持 `Array.isArray`），用 `Object.prototype.toString` 作为 polyfill。
