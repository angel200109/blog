# 不同类型宏任务的优先级

## 简介

都知道 JS 的事件循环分宏任务和微任务，微任务比宏任务优先执行。但宏任务之间也有优先级差异——不是谁先进队列谁先跑。这跟浏览器对用户体验的考量直接相关。

## 核心概念

### 宏任务的类型

常见的宏任务有：

| 任务源 | 触发方式 |
|--------|----------|
| DOM 事件 | 用户点击、键盘输入 |
| I/O | 网络请求回调、文件读取 |
| setTimeout / setInterval | 定时器到期 |
| requestAnimationFrame | 浏览器重绘前 |
| postMessage | 跨文档通信 |
| UI 渲染 | 浏览器自带渲染管道 |

### 实际的优先级

浏览器并没有一个标准的"宏任务优先级文档"，但从行为可以观察到：

**用户输入 > 渲染 > 定时器回调**

```js
button.addEventListener('click', () => {
  setTimeout(() => console.log('setTimeout'), 0)
  requestAnimationFrame(() => console.log('rAF'))
})

// 点击按钮后的输出顺序：
// rAF
// setTimeout
```

虽然 `setTimeout` 先注册，但 `requestAnimationFrame` 先执行。这是因为 rAF 和渲染管线绑定，浏览器在每帧开始前会先清空 rAF 队列。

### requestAnimationFrame 的特殊地位

rAF 的优先级通常高于 setTimeout——它被归为"渲染相关的宏任务"，浏览器在每帧的渲染阶段优先处理：

```
每帧流程：
用户输入 → JS 执行 → rAF 回调 → 样式计算 → 布局 → 绘制 → 空闲时间
```

不过 rAF 只在页面可见时触发，切到后台标签页就不会跑了。

### 用户输入的优先级

用户交互产生的宏任务（click、scroll、input 等）通常会在同一帧内优先处理。这是浏览器的设计原则：**用户体验优先**，不能让用户点个按钮还要等定时器跑完。

```js
// 假设页面卡住时用户疯狂点击
// 浏览器会合并连续的同类事件（如多次 scroll）
// 但确保至少有一个事件在下一帧得到处理
```

## 实战场景

如果你想做流畅的动画，用 `requestAnimationFrame` 别用 `setTimeout`：

```js
// 不好
setTimeout(() => {
  el.style.left = pos + 'px'
  pos += 1
}, 16)

// 好——和浏览器刷新率同步
function animate() {
  el.style.left = pos + 'px'
  pos += 1
  requestAnimationFrame(animate)
}
```

另一个常见场景：你需要在 DOM 更新后立刻获取尺寸。因为渲染在宏任务末尾执行，可以这样：

```js
el.classList.add('expanded')
// 此时 DOM 变了但布局还没算
requestAnimationFrame(() => {
  // 布局已完成，可以读到正确尺寸
  const height = el.offsetHeight
})
```

## 总结

宏任务之间不是 FIFO 铁板一块。rAF 和渲染有最高优先级，用户交互次之，定时器垫底。做动画用 rAF，需要精确延时的用 setTimeout 但别依赖它做精确计时。
