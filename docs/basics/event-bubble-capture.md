# 事件冒泡和阻止冒泡


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

