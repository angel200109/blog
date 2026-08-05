# Vue Scoped 样式原理

### Scoped 的作用

在 Vue 单文件组件中，`<style scoped>` 标签内的 CSS 规则只作用于当前组件，不会泄漏到子组件或其他组件中。

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

这个 `.title` 选择器不会影响父组件或兄弟组件中的 `.title` 元素。

### 实现机制

Vue 的编译器（`vue-loader` 或 `@vue/compiler-sfc`）在处理 `<style scoped>` 时做了两件事：

**给模板中的元素添加唯一属性。** 编译后，当前组件模板中的每个 HTML 元素都会被追加一个形如 `data-v-xxxxx` 的自定义属性，其中 `xxxxx` 是通过文件路径和内容哈希生成的唯一标识。

```html
<!-- 编译前（模板源码） -->
<h1 class="title">Hello</h1>

<!-- 编译后 -->
<h1 class="title" data-v-f3f3eg9>Hello</h1>
```

**给 CSS 选择器追加属性选择器。** 编译器会重写样式规则，在每个选择器末尾拼接 `[data-v-xxxxx]`，使规则只能匹配到带有对应属性的元素。

```css
/* 编译前 */
.title { color: red; }

/* 编译后 */
.title[data-v-f3f3eg9] { color: red; }
```

### 对子组件的渗透规则

Scoped 样式默认不会穿透到子组件的内部元素。但如果确实需要影响子组件的根节点，可以使用 `>>>`、`/deep/` 或 `::v-deep` 深度选择器：

```css
/* 让 .parent 的 scoped 样式作用于子组件的 .child */
.parent ::v-deep .child {
  font-size: 14px;
}
```

编译后，Vue 会将该规则拆分为带属性选择器的形式，使它可以匹配到子组件根元素上带有当前组件 scope 属性的节点。

### 与 CSS Modules 的对比

Scoped 和 CSS Modules 都是 Vue 支持的样式隔离方案，差异在于：

- **Scoped**：通过属性选择器实现隔离，样式仍然是全局的（只是选择器加了限定），写法与普通 CSS 一致，学习成本低。
- **CSS Modules**：通过编译时生成唯一类名实现隔离，在 JS 中以对象形式引用类名，天然避免了类名冲突，但需要额外的语法学习。

小型项目或组件库内部通常使用 Scoped 足够，大型团队协作项目中 CSS Modules 的类名哈希机制在避免冲突方面更可靠。
