# Vue keep-alive

### keep-alive 的作用

`<keep-alive>` 是 Vue 内置的抽象组件，用于缓存被包裹的动态组件的实例。当组件在 `<keep-alive>` 内部被切换走时，Vue 不会销毁它，而是将其缓存在内存中；下次切换回来时，直接复用缓存的实例，跳过创建和挂载阶段。

```html
<keep-alive>
  <component :is="currentTab" />
</keep-alive>
```

`currentTab` 变化时，之前的组件实例被缓存而非销毁，组件的内部状态（数据、滚动位置、表单输入等）得以保留。

### 缓存策略控制

**include / exclude**：通过组件名称精确控制哪些组件被缓存。

```html
<!-- 只缓存 UserList 和 UserDetail -->
<keep-alive :include="['UserList', 'UserDetail']">
  <router-view />
</keep-alive>

<!-- 缓存除 Setting 之外的所有组件 -->
<keep-alive :exclude="['Setting']">
  <router-view />
</keep-alive>
```

**max**：限制最大缓存实例数量。超出上限时，最久未访问的实例会被销毁。

```html
<keep-alive :max="5">
  <component :is="currentView" />
</keep-alive>
```

### 生命周期钩子

被 `<keep-alive>` 包裹的组件会额外获得两个生命周期钩子：

- **`activated`**：组件被激活（从缓存中取出并插入 DOM）时调用。
- **`deactivated`**：组件被停用（从 DOM 中移除但保留缓存）时调用。

```js
export default {
  activated() {
    // 从缓存恢复时刷新数据
    this.fetchLatest()
  },
  deactivated() {
    // 离开时清理定时器
    clearInterval(this.timer)
  }
}
```

这两个钩子在服务端渲染期间不会被调用。

### 结合路由使用

`<keep-alive>` 最常见的场景是与 `<router-view>` 配合，实现路由级别的组件缓存：

```html
<keep-alive :include="cachedRoutes">
  <router-view />
</keep-alive>
```

结合路由元信息 `meta` 可以实现按路由配置缓存策略：

```js
const routes = [
  {
    path: '/list',
    component: ListPage,
    meta: { keepAlive: true }
  },
  {
    path: '/detail/:id',
    component: DetailPage,
    meta: { keepAlive: false }
  }
]
```

在模板中通过 `$route.meta.keepAlive` 条件决定是否缓存。

### 注意事项

`<keep-alive>` 要求被包裹的组件必须有 `name` 选项，或者使用 `include` / `exclude` 时组件名称必须与之匹配，否则缓存策略无法生效。此外，`<keep-alive>` 本身不会渲染 DOM 元素，它只是一个功能性包裹组件。
