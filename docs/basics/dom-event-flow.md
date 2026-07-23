# DOM 事件流：捕获、目标、冒泡

## 简介

页面上点一个按钮，浏览器不是直接通知那个按钮，而是走一套完整的传播流程。这个流程叫事件流（Event Flow），分三个阶段：捕获、目标、冒泡。搞清这三个阶段，事件委托和阻止冒泡才有根基。

## 核心概念

### 三个阶段

1. **捕获阶段**：事件从 `window` 一路向下，经过层层 DOM 节点，往目标元素走
2. **目标阶段**：事件到达真正被点击的元素
3. **冒泡阶段**：事件从目标元素原路返回，一路冒到 `window`

用代码感受一下：

```js
baby.addEventListener('click', () => console.log('baby 冒泡'), false);
daughter.addEventListener('click', () => console.log('daughter 捕获'), true);
mother.addEventListener('click', () => console.log('mother 捕获'), true);
grandma.addEventListener('click', () => console.log('grandma 冒泡'), false);

// 点击 baby 后输出：
// mother 捕获    ← 从外到内，先走捕获
// daughter 捕获
// baby 冒泡      ← 目标阶段
// grandma 冒泡   ← 从内到外，再走冒泡
```

`addEventListener` 第三个参数：`true` 是捕获阶段触发，`false`（默认）是冒泡阶段触发。

### 冒泡路线的完整路径

一个 div 被点击，冒泡路线的全路径是：`div → body → html → document → window`。

## 实战场景

大多数情况下我们都在冒泡阶段处理事件，这也是事件委托能工作的基础。捕获阶段用得少，但有些场景必须用它——比如你要在子元素的事件触发之前先拦截处理，或者处理 `focus` 这种不冒泡的事件（用 `focusin` 替代）。

## 总结

事件先捕获、再目标、后冒泡。`addEventListener` 默认在冒泡阶段触发。理解这个流程，事件委托和阻止冒泡就好懂了。
