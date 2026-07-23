# Attribute 和 Property 的区别

## 简介

Attribute 和 Property 都被翻译成"属性"，但它们是两码事。一个写在 HTML 标签上，一个活在 JS 对象里。搞混了会导致表单取值不对、样式绑定失效、自定义数据读不出来等一堆问题。

## 核心概念

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

## 实战场景

React 和 Vue 里写 JSX/template 时，大部分情况操作的是 Property。但 `data-*`、`aria-*`、SVG 属性等要走 Attribute。框架已经帮你处理好了，但偶尔用 `ref` 直接操作 DOM 时，搞清楚该用 `.value` 还是 `.getAttribute('value')` 能少踩很多坑。

## 总结

Attribute 是 HTML 文档里的初始值，Property 是 JS 对象里的实时状态。表单的 `value` 最典型：Attribute 不动，Property 跟用户输入走。
