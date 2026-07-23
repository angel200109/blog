# 事件委托：用冒泡省掉一万个监听器

## 简介

页面上有一个列表，里面 100 个按钮，你给每个按钮都绑一个 `click`？当然不用。把监听器绑在父元素上，靠冒泡机制统一处理——这就是事件委托。省内存、省代码，还能自动适配动态新增的元素。

## 核心概念

### 原理

事件委托利用的是冒泡：子元素的事件会冒到父元素，父元素通过 `e.target` 知道到底是谁触发的。

```js
document.getElementById('list').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    console.log('点击了:', e.target.textContent);
  }
});
```

这样不管列表里有多少按钮，甚至后面动态加进来的按钮，统统不用单独绑定。

### 为什么要这样做

- **省内存**：100 个按钮 = 1 个监听器，而不是 100 个
- **省维护**：新增元素不需要手动绑事件
- **性能好**：大量 DOM 操作时减少监听器注册次数

### 注意事项

`e.target` 不一定是你要的那个元素——点击按钮里的 `<span>` 图标，`e.target` 就是 `<span>` 而不是 `<button>`。需要向上查找：

```js
list.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (btn) {
    console.log('点击了:', btn.textContent);
  }
});
```

## 实战场景

Vue 里写 `@click`，每个元素仍然会注册独立监听器（Vue 在底层做了这件事）。如果列表特别大、性能敏感，可以考虑手动在父元素绑事件做委托。React 17 之后把事件委托到了 `root` 节点，也是类似思路。

## 总结

事件委托 = 把监听器挂在父元素上，靠冒泡和 `e.target` 判断来源。动态列表场景的首选方案。
