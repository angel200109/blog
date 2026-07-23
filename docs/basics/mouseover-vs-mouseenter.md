# mouseover 和 mouseenter 的区别

## 简介

这两个事件看起来一样——都是鼠标进入元素时触发。但有一个关键差异，足以让你在写 hover 交互时出 bug：`mouseover` 会冒泡，`mouseenter` 不会。

## 核心概念

### 行为对比

```html
<div id="outer" style="padding: 40px; background: #eee;">
  外层
  <div id="inner" style="padding: 20px; background: #ccc;">
    内层
  </div>
</div>
```

```js
const outer = document.getElementById('outer');

// mouseover：鼠标从外层移到内层也会触发
outer.addEventListener('mouseover', () => console.log('mouseover 触发'));

// mouseenter：只在真正进入外层时触发一次
outer.addEventListener('mouseenter', () => console.log('mouseenter 触发'));
```

鼠标从外部移入 outer：两者都触发。

鼠标从 outer 移到 inner：`mouseover` 再次触发（因为 inner 的 `mouseover` 冒到了 outer），`mouseenter` 不触发。

### 对应的事件对

- `mouseover` / `mouseout`：会冒泡
- `mouseenter` / `mouseleave`：不冒泡

```js
outer.addEventListener('mouseout', () => console.log('mouseout'));
outer.addEventListener('mouseleave', () => console.log('mouseleave'));
```

鼠标从 outer 移到 inner：`mouseout` 触发（冒泡），`mouseleave` 不触发。

### 什么时候用哪个

**用 `mouseenter`/`mouseleave` 的场景**：hover 卡片效果、下拉菜单——不希望子元素触发父元素的进入/离开。

**用 `mouseover`/`mouseout` 的场景**：事件委托，需要在父元素上感知所有子元素的鼠标进出。

## 实战场景

实现一个下拉菜单，鼠标移入显示、移出隐藏。如果用 `mouseover`/`mouseout`，鼠标在菜单项之间移动时会疯狂闪烁——因为进出子元素不断触发父元素的 `mouseout`/`mouseover`。换成 `mouseenter`/`mouseleave` 就好了。

## 总结

`mouseenter`/`mouseleave` 不冒泡，适合处理父元素的整体 hover 状态。`mouseover`/`mouseout` 会冒泡，适合事件委托。下拉菜单、tooltip、卡片悬浮效果一律用 `mouseenter`。
