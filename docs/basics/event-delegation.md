# 事件委托的原理与实践

### 为什么需要事件委托

在一个包含大量子元素的容器中，为每一个子元素单独绑定事件监听器会产生数量可观的内存开销。更麻烦的是动态渲染的场景：每当新增或删除一个子元素，都需要手动处理对应的事件绑定和销毁，否则要么遗漏绑定导致新元素不响应事件，要么忘记解绑导致内存泄漏。

事件委托（Event Delegation）直接解决了这两个问题。它的思路是：不在子元素上逐一绑定监听器，而是在父元素上绑定一个监听器，利用事件冒泡机制，让子元素上触发的事件沿 DOM 树向上冒泡，最终被父元素的监听器捕获。在监听器内部通过 `event.target` 判断事件的实际触发源，执行对应的处理逻辑。

### 一个完整示例

```html
<h3>按钮列表（事件委托示例）</h3>
<ul id="list">
  <li><button>按钮 1</button></li>
  <li><button>按钮 2</button></li>
  <li><button>按钮 3</button></li>
</ul>

<script>
  // 父元素统一监听
  document.getElementById("list").addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      console.log("点击了按钮:", e.target.innerText);
      alert("你点击了：" + e.target.innerText);
    }
  });

  // 动态添加新按钮，仍然有效
  const newBtn = document.createElement("li");
  newBtn.innerHTML = "<button>新增按钮</button>";
  document.getElementById("list").appendChild(newBtn);
</script>
```

代码中只在 `#list` 上绑定了一个 `click` 监听器。`<li>` 内的 `<button>` 被点击时，事件冒泡到 `#list`，回调通过 `e.target.tagName === "BUTTON"` 判断触发源是否为按钮。`appendChild` 动态插入的新按钮同样会冒泡并被同一监听器处理——不需要额外绑定。

### 事件委托的工程收益

- **减少监听器数量**：从 O(n) 降到 O(1)，内存占用显著降低
- **自动覆盖动态元素**：新增或删除子节点不需要同步维护事件绑定，代码逻辑更内聚
- **适合高频更新的 DOM**：表格行排序、搜索结果列表、虚拟滚动容器等场景尤为受益

### 需要注意的几个点

并非所有事件都支持委托。需要依赖事件冒泡才能将子元素的事件传递到父元素。`focus`、`blur`、`scroll` 等事件默认不冒泡，无法直接用于委托（`focus` 和 `blur` 可以使用对应的 `focusin` 和 `focusout` 替代，它们会冒泡）。

`e.target` 与 `e.currentTarget` 在委托场景下的区分很重要：`e.target` 是实际触发事件的子元素（点击的是哪个按钮），`e.currentTarget` 是绑定监听器的父元素（`#list`）。处理逻辑应该检查 `e.target` 而不是 `e.currentTarget`。

如果子元素内部还有嵌套结构（例如按钮内有一个 `<span>`），`e.target` 可能是 `<span>` 而非 `<button>`。此时需要使用 `closest` 方法向上查找：

```javascript
document.getElementById("list").addEventListener("click", function (e) {
  const button = e.target.closest("button");
  if (button) {
    console.log("点击了:", button.innerText);
  }
});
```

### 在 Vue 中的应用

Vue 的事件绑定语法（`@click`、`@change` 等）底层仍遵循原生事件流，因此事件委托在 Vue 中同样有效。对于 `v-for` 渲染的动态列表，在父容器上绑定事件而非在每个子项上绑定，可以减少 Vue 内部为每个子项创建事件处理函数的开销：

```vue
<template>
  <ul @click="handleClick">
    <li v-for="item in items" :key="item.id">
      <button :data-id="item.id">{{ item.name }}</button>
    </li>
  </ul>
</template>

<script setup>
const handleClick = (e) => {
  const button = e.target.closest('button');
  if (button) {
    const id = button.dataset.id;
    // 处理点击逻辑
  }
};
</script>
```
