# 事件冒泡和阻止冒泡

## 简介

事件冒泡是 DOM 事件的默认行为——子元素上的事件会一层层向上传递。大多数时候这是好事（事件委托就靠它），但有时候你不想让事件继续往上冒，就得阻止它。

## 核心概念

### 冒泡的默认行为

```html
<div onclick="console.log('div')">
  <button onclick="console.log('btn')">点我</button>
</div>
```

点按钮，输出 `btn` 然后 `div`——事件从按钮冒到了父 div。嵌套越深，冒得越远。

### 阻止冒泡

原生 JS 用 `e.stopPropagation()`：

```js
btn.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('按钮被点击，但不会冒到 div');
});
```

Vue 里更简单，用事件修饰符：

```html
<button @click.stop="handleClick">点我</button>
```

`.stop` 修饰符就相当于调了 `e.stopPropagation()`。

### stopPropagation vs stopImmediatePropagation

如果同一个元素上绑了多个同类型事件的监听器：

- `stopPropagation()`：阻止向上冒泡，但当前元素上的其他监听器照常执行
- `stopImmediatePropagation()`：阻止冒泡 + 阻止当前元素上的后续监听器

```js
btn.addEventListener('click', () => console.log('第一个'));
btn.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('第二个');
});
btn.addEventListener('click', () => console.log('第三个')); // 不会执行
```

## 实战场景

弹窗里点关闭按钮时，如果弹窗的容器也绑了 `click`，很容易点了关闭按钮顺带触发了容器事件。这时候 `@click.stop` 是标准操作。下拉菜单、模态框、抽屉组件里都有类似需求。

## 总结

事件默认冒泡，用 `stopPropagation` 阻止。Vue 用 `.stop` 修饰符。同一个元素上多个监听器要全拦，用 `stopImmediatePropagation`。
