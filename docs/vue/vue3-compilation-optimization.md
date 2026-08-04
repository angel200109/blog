# Vue3 编译优化

### 什么是"编译"

在 Vue 里，"编译"指的是模板语法（`<template>`）在构建阶段被转换成 render 函数的过程。这个转换在打包时就完成了，不占用浏览器运行时。

### 三大编译优化

**静态提升（Static Hoisting）**

模板里不变的内容——没有 `{{ }}`、没有 `:class="xxx"`、没有 `@click` 的纯静态节点——在编译时就被提到 render 函数外面变成常量。每次组件更新不需要重新创建这些节点，直接从常量池取。

```js
// 编译前
<div>
  <h1>这是静态标题</h1>
  <p>{{ dynamicText }}</p>
</div>

// 编译后（简化示意）
const _hoisted_1 = h('h1', null, '这是静态标题')  // 提到外面
function render() {
  return h('div', null, [_hoisted_1, h('p', null, ctx.dynamicText)])
}
```

**Patch Flag（补丁标记）**

每个动态节点被标记上它会变化的类型——TEXT（文本变了）、CLASS（class 变了）、STYLE（style 变了）、PROPS（属性变了）等等。Diff 时只看标记了的部分，不用做全量属性比对。

**Block Tree（动态节点树）**

Vue3 把模板中的动态节点单独抽成一棵"Block Tree"。更新时直接遍历这棵树，静态子树完全不参与 Diff。比如一个 100 个节点的页面，如果只有 3 个是动态的，Diff 就只遍历这 3 个。

### 一句话总结

Vue3 的编译优化思路很统一：**把能提前做的都提前做完，运行时只处理必须处理的部分**。静态提升是"提前创建好"，Patch Flag 是"提前标记好"，Block Tree 是"提前分类好"——三招都服务于同一个目标：让运行时 Diff 的工作量最小化。
