# DOM 事件流：捕获、目标、冒泡


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

