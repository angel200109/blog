# 事件三要素与绑定/解绑


### 事件三要素

1. **事件源**：谁触发事件——那个 DOM 元素
2. **事件类型**：什么行为触发——`click`、`keydown`、`scroll` 等
3. **事件处理函数**：触发后干什么

缺一个，事件机制就跑不起来。

### 绑定事件的三种方式

```js
const btn = document.querySelector('button');

// 方式一：HTML 内联（不推荐，耦合太紧）
// <button onclick="handleClick()">

// 方式二：DOM 属性（简单，但只能绑一个）
btn.onclick = () => console.log('点击');

// 方式三：addEventListener（推荐，支持多个监听器）
btn.addEventListener('click', handler1);
btn.addEventListener('click', handler2); // 两个都会触发
```

`onclick` 是覆盖式的，后面的会顶掉前面的。`addEventListener` 是叠加式的。

### 解绑事件

```js
function handler() {
  console.log('点击');
}

btn.addEventListener('click', handler);
btn.removeEventListener('click', handler); // 必须传同一个函数引用
```

坑在于：**匿名函数解不掉**。

```js
btn.addEventListener('click', () => console.log('点'));
btn.removeEventListener('click', () => console.log('点')); // 无效！这是两个不同的函数
```

匿名函数每次都是新引用，`removeEventListener` 找不到匹配的。所以需要解绑的事件，必须用命名函数。

### once 选项

如果事件只需要触发一次，用 `once` 选项，自动解绑：

```js
btn.addEventListener('click', handler, { once: true });
```

