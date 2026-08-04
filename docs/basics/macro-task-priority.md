# 不同类型宏任务的优先级


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

