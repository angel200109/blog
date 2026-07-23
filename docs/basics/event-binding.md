# 事件三要素与绑定/解绑

## 简介

给元素绑事件看起来简单，但事件源、事件类型、事件处理函数这三要素缺一不可。绑定方式也有讲究——用 `onclick` 还是 `addEventListener`？绑了要不要解？解绑时匿名函数怎么处理？这些都是日常开发的细节。

## 核心概念

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

## 实战场景

写组件时，`onMounted` 里绑定全局事件（scroll、resize），`onUnmounted` 里一定要解绑——不然组件销毁了事件还在，轻则内存泄漏，重则报错。用 `{ once: true }` 可以省掉手动解绑，但只适用于单次触发场景。

## 总结

事件三要素：谁、什么行为、干什么。绑定用 `addEventListener`，解绑用 `removeEventListener` 且必须传同一个函数引用。需要解绑就别用匿名函数。
