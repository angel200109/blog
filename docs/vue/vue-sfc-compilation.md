# .vue 单文件组件编译流程

### 拆成三部分

一个 `.vue` 文件经过 `vue-loader` 后会被拆分为三类资源：`<template>`、`<script>`、`<style>`。这只是编译流程的入口，后续 `VueLoaderPlugin` 会将不同资源分发给对应的 webpack loader 继续处理。

### 三条流水线

**Script 块** → `babel-loader`：将 TS / ES6+ 语法转换为目标浏览器可以执行的 JavaScript。Vue3 中常用的 `<script setup>` 也会在编译阶段处理，`defineProps`、`defineEmits` 这类宏会被转换为运行时所需的组件配置。

**Style 块** → `css-loader` + `style-loader`：将 CSS 处理为可以被 JavaScript 注入页面的样式。如果带有 `scoped` 属性，编译器会为选择器追加唯一的 `data-v-xxx` 属性，从而实现组件级样式隔离，降低样式互相影响的风险。

**Template 块** → `vue-template-compiler`（Vue2）/ `@vue/compiler-sfc`（Vue3）：这是最关键的一步，把模板编译成 render 函数。Vue3 在这一步还做了静态提升和 Patch Flag 优化。

### 为什么需要这套编译流程

浏览器的能力边界很明确：它可以解析 HTML、CSS 和 JavaScript，但无法直接识别 `.vue` 文件、插值表达式 `{{ }}` 或 `v-model` 这类 Vue 模板语法。整个编译流程的本质，就是将 Vue 的组件语法转换为浏览器可以执行的标准资源。`.vue` 文件提升了组件组织效率，编译器负责将这种开发层面的抽象转换为运行时可执行的代码。
