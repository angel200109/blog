# Attribute 和 Property 的区别


### Attribute：HTML 标签上的"静态属性"

写在 HTML 里，属于 HTML 文档本身：

```html
<input type="text" value="初始值" data-id="123" />
```

用 `getAttribute` / `setAttribute` 操作：

```js
input.getAttribute('value');   // "初始值"
input.getAttribute('data-id'); // "123"
input.setAttribute('data-id', '456');
```

### Property：JS 对象上的"动态属性"

DOM 元素在 JS 里是一个对象，Property 是这个对象上的属性：

```js
input.value;       // 当前输入框里的实际值
input.type;        // "text"
input.dataset.id;  // "123"（data-* 的快捷方式）
```

### 关键差异：value 不同步

这是最常见的坑——`input` 的 `value` Attribute 和 Property 是脱钩的：

```js
// HTML: <input value="初始值" />
const input = document.querySelector('input');

// Attribute：永远是 HTML 里写的那个值
input.getAttribute('value'); // "初始值"

// 用户在输入框里打了 "新内容"
input.value;                 // "新内容"（Property 变了）
input.getAttribute('value'); // "初始值"（Attribute 没变）
```

Attribute 是"默认值"，Property 是"当前值"。

### 什么时候同步，什么时候不同步

- **同步的**：`id`、`class`（但叫 `className`）、`type`、`href` 等——改一边，另一边跟着变
- **不同步的**：`value`（表单元素）、`checked`、`selected`——各管各的

