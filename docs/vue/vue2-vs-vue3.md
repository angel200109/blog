# Vue2 和 Vue3 的具体区别

### 响应式系统：defineProperty → Proxy

Vue2 用 `Object.defineProperty` 逐个劫持对象属性。于是有了三个经典痛点：新增属性感知不到（需要 `$set`）、数组下标修改感知不到（需要重写 7 个数组方法）、初始化时递归遍历所有属性（深层对象初始化慢）。

Vue3 换 `Proxy` 后全部解决：代理整个对象，新增/删除属性自动拦截，数组下标直接支持，而且懒代理——只有访问到深层属性时才去代理，初始化快得多。

### API 风格：Options API → Composition API

Vue2 的 Options API 按 data、methods、computed 等功能选项组织代码。项目小时很直观，但组件一大，同一个逻辑的代码散落在 data、methods、watch、computed 好几个地方，阅读和重构都费劲。

Vue3 的 Composition API（`setup` / `<script setup>`）让你按**逻辑关注点**组织代码。一个数据获取逻辑的 data、loading、error、fetch 方法可以写在一起，一眼看完一条完整逻辑链。

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

Vue3 在编译阶段引入了静态提升（静态节点提到 render 函数外）、Patch Flag（标记动态部分）、Block Tree（把动态节点单独成树，Diff 时跳过整棵静态子树）。这些是 Vue2 完全没有的编译层优化，直接导致 Vue3 在大型应用中的更新性能显著优于 Vue2。

### 其他变化

- **Fragment**：Vue3 组件可以有多个根节点，不用再套无意义的 `<div>` 包一层
- **TypeScript**：Vue3 用 TS 重写核心代码，类型推导和 IDE 提示体验全面提升
- **Tree-shaking**：Vue3 用 ES Module 输出，未使用的 API 打包时自动剔除
- **Teleport**：新增组件，可以把内容渲染到 DOM 树的任意位置
