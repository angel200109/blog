# Vue2 和 Vue3 的具体区别

### 响应式系统：defineProperty → Proxy

Vue2 使用 `Object.defineProperty` 逐个劫持对象属性，因此存在三个典型限制：新增属性无法自动感知（需要 `$set`）、数组下标修改无法直接感知（需要重写 7 个数组方法）、初始化阶段需要递归遍历所有属性（深层对象初始化成本较高）。

Vue3 改用 `Proxy` 后，响应式系统可以代理整个对象，新增/删除属性能够被自动拦截，数组下标修改也可以直接支持。同时 Vue3 采用懒代理策略，只有访问到深层属性时才继续代理其子属性，初始化成本更低。

### API 风格：Options API → Composition API

Vue2 的 Options API 按 data、methods、computed 等功能选项组织代码。项目规模较小时这种结构很直观，但组件变复杂后，同一业务逻辑可能分散在 data、methods、watch、computed 等多个位置，阅读和重构成本都会增加。

Vue3 的 Composition API（`setup` / `<script setup>`）允许开发者按**逻辑关注点**组织代码。以数据请求逻辑为例，data、loading、error 和 fetch 方法可以集中维护在同一个组合函数或同一段逻辑中，完整逻辑链更容易被理解和复用。

### 生命周期变化

| 阶段 | Vue2 | Vue3（Composition API） |
|------|------|------------------------|
| 创建前 | `beforeCreate` | `setup()` 替代 |
| 创建后 | `created` | `setup()` 替代 |
| 挂载前 | `beforeMount` | `onBeforeMount` |
| 挂载后 | `mounted` | `onMounted` |
| 更新前 | `beforeUpdate` | `onBeforeUpdate` |
| 更新后 | `updated` | `onUpdated` |
| 销毁前 | `beforeDestroy` | `onBeforeUnmount` |
| 销毁后 | `destroyed` | `onUnmounted` |

Vue3 里 `beforeCreate` 和 `created` 的作用完全被 `setup()` 取代，不再需要单独的钩子。

### 编译与性能优化

Vue3 在编译阶段引入了静态提升（静态节点提升到 render 函数外）、Patch Flag（标记动态部分）、Block Tree（将动态节点组织为独立结构，Diff 时跳过静态子树）。这些是 Vue2 不具备的编译层优化，也是 Vue3 在大型应用中更新性能更好的重要原因。

### 其他变化

- **Fragment**：Vue3 组件可以有多个根节点，不再需要额外包裹一个无语义的 `<div>`
- **TypeScript**：Vue3 使用 TS 重写核心代码，类型推导和 IDE 提示体验更好
- **Tree-shaking**：Vue3 用 ES Module 输出，未使用的 API 打包时自动剔除
- **Teleport**：新增组件，可以把内容渲染到 DOM 树的任意位置
