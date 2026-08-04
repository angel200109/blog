# .vue 单文件组件编译流程

### 拆成三部分

一个 `.vue` 文件经过 `vue-loader` 后会被拆成三块：`<template>`、`<script>`、`<style>`。但这只是第一步，接下来 `VueLoaderPlugin` 会把每一块派发给正确的 webpack loader。

### 三条流水线

**Script 块** → `babel-loader`：把 TS / ES6+ 语法转成浏览器能跑的 JS。Vue3 默认用 `<script setup>`，编译器还会对 `defineProps`、`defineEmits` 这些宏做编译时转换。

**Style 块** → `css-loader` + `style-loader`：把 CSS 处理成 JS 可注入的样式。如果带了 `scoped` 属性，编译器会给选择器追加一个唯一的 `data-v-xxx` 属性，实现样式隔离——父组件的样式不会漏到子组件里。

**Template 块** → `vue-template-compiler`（Vue2）/ `@vue/compiler-sfc`（Vue3）：这是最关键的一步，把模板编译成 render 函数。Vue3 在这一步还做了静态提升和 Patch Flag 优化。

### 为什么需要这套编译流程

浏览器的能力边界很明确：它认识 HTML、CSS、JS，但不认识 `.vue` 文件，不认识插值表达式 `{{ }}`，不认识 `v-model`。整个编译流程本质上就是把"Vue 语言"翻译成"浏览器语言"。`.vue` 让开发者用更高效的方式组织组件，编译器负责把这份便利转换成浏览器能理解的东西。
