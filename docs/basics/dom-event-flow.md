# DOM 事件流：捕获、目标与冒泡

### 什么是事件流

事件流（Event Flow）是浏览器中事件在 DOM 节点树上的传播路径。当用户点击页面上的某个元素时，事件并非只在该元素上触发，而是沿着一条既定路线在 DOM 树中传播。这条路线分为三个阶段。

**捕获阶段**：事件从 `window` 顶层节点出发，沿 DOM 树由外向内逐层传递，直到抵达目标元素。

**目标阶段**：事件到达实际触发操作的目标元素本身。

**冒泡阶段**：事件从目标元素开始，沿 DOM 树由内向外逐层向上传播，直到 `window`。

```html
<div class="grandma">
  grandma 奶奶
  <div class="mother">
    mother 妈妈
    <div class="daughter">
      daughter 女儿
      <div class="baby">baby 婴儿</div>
    </div>
  </div>
</div>
```

### 一个完整的示例

用以下嵌套结构来演示三个阶段的实际执行顺序：

```javascript
var grandma = document.getElementsByClassName("grandma")[0];
var mother  = document.getElementsByClassName("mother")[0];
var daughter = document.getElementsByClassName("daughter")[0];
var baby     = document.getElementsByClassName("baby")[0];

function theName() {
  console.log("我是 " + this.className);
}

baby.addEventListener("click", theName, false);    // 冒泡阶段
daughter.addEventListener("click", theName, true); // 捕获阶段
mother.addEventListener("click", theName, true);   // 捕获阶段
grandma.onclick = theName;                         // 默认冒泡
```

点击最内层的 `baby` 元素时，控制台输出顺序为：

```
我是 mother      // 捕获阶段
我是 daughter    // 捕获阶段
我是 baby        // 目标阶段
我是 grandma     // 冒泡阶段
```

`addEventListener` 的第三个参数为 `true` 表示在捕获阶段触发，`false`（默认值）表示在冒泡阶段触发。`onclick` 属性绑定也默认在冒泡阶段。

执行流程：事件从外向内捕获——经过 `mother` 和 `daughter`（它俩注册了捕获监听器）——到达 `baby`（目标阶段，它注册了冒泡监听器）——然后从内向外冒泡——经过 `grandma`（它注册了冒泡监听器）。

一个 `div` 元素完整的冒泡传播路线是：`div → body → html → document → window`。

### 阻止事件传播

在捕获或冒泡阶段，可以通过 `event.stopPropagation()` 阻止事件继续传播：

```javascript
element.addEventListener("click", function(e) {
  e.stopPropagation(); // 事件不会继续向下（捕获）或向上（冒泡）
});
```

`stopPropagation` 只阻止传播，不影响当前元素上其他同阶段监听器的执行。如果需要连同一元素上的其他监听器也阻止，可以使用 `event.stopImmediatePropagation()`。

### 设计目的与工程价值

三阶段模型的设计为开发者提供了两个有价值的工程能力。

第一个是灵活选择监听时机。可以在捕获阶段做权限校验或在事件到达目标前拦截处理，也可以在冒泡阶段处理具体的业务逻辑。

第二个是事件委托。借助冒泡机制，可以将大量子元素的监听器收敛到父元素上，通过 `event.target` 判断事件的实际触发源。这在动态列表、表格等场景中可以显著减少监听器的数量。

### Vue 中的事件流

Vue 的 `@click` 等事件绑定语法本质上是对原生 `addEventListener` 的封装，底层仍然遵循捕获、目标、冒泡的流程。Vue 模板中可以使用 `.capture` 修饰符将监听器注册在捕获阶段：

```vue
<div @click.capture="handleCapture">
  <button @click="handleClick">点我</button>
</div>
```

事件委托在 Vue 中同样适用，尤其是在 `v-for` 渲染的动态列表上，将事件绑定在父容器比在每个子项上重复绑定更高效。
