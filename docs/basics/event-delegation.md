# 事件委托：用冒泡省掉一万个监听器


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

