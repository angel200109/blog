# Vuex 与 Pinia 的对比

### 历史定位

Vuex 是 Vue 2 时代官方标配的状态管理方案，基于 Flux 模式设计。Pinia 是 Vue 3 生态下的新一代状态管理库，由 Vuex 核心团队成员开发，在 Vue 3 项目中逐渐取代 Vuex。

### 核心设计上的差异

**无需 mutations**：Vuex 要求修改 state 必须通过 mutation（同步操作）和 action（异步操作）两层。Pinia 将两者合并，直接在 action 中修改 state，减少了一层概念。

```js
// Vuex —— 两段式
mutations: {
  increment(state) { state.count++ }
},
actions: {
  async fetchAndIncrement({ commit }) {
    await api.getData()
    commit('increment')
  }
}

// Pinia —— 直接在 action 中修改
actions: {
  async fetchAndIncrement() {
    await api.getData()
    this.count++
  }
}
```

**模块化的实现方式不同**：Vuex 使用单一的 store 加嵌套 modules，模块通过 `namespaced` 区分，调用时需要拼接路径（`'userModule/fetchData'`）。Pinia 将每个 store 定义为独立单元，天然模块化，使用时按需导入即可，不需要手动拼接命名空间。

```js
// Pinia：按业务域定义独立 store
// stores/auth.js
export const useAuthStore = defineStore('auth', { ... })

// stores/order.js
export const useOrderStore = defineStore('order', { ... })

// 组件中使用
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
```

**TypeScript 支持**：Vuex 的 TypeScript 类型推断需要手动写大量类型声明，体验欠佳。Pinia 从设计之初就考虑了 TypeScript，`defineStore` 返回的类型可以自动推断，不需要额外声明。

**废除 getters 的函数参数**：Pinia 的 getters 不再接收其他 getters 作为第二个参数，改为通过 `this` 直接访问同一 store 内的其他 getter，写法更直观。

### 功能层面的差异对比

| 特性 | Vuex 4 | Pinia |
|------|--------|-------|
| mutations | 必须 | 无（直接改 state） |
| 模块嵌套 | 支持，需配置 namespaced | 每个 store 独立，不嵌套 |
| TypeScript | 需要额外类型声明 | 开箱即用 |
| DevTools 支持 | 支持 | 支持（且调试体验更好） |
| 体积 | ~10KB | ~5KB |
| 允许创建多个 store | 不建议（设计上单一） | 天然支持多 store |
| 废弃 `$store` 全局注入 | 需要 | 不需要（按需导入） |

### 迁移建议

新项目直接使用 Pinia，它已经是 Vue 官方推荐的状态管理方案。老项目如果用的是 Vuex 3/4，不需要强行迁移——Vuex 仍然稳定可用。如果项目升级到了 Vue 3 并且计划长期维护，可以逐步将 Vuex modules 转换为 Pinia stores，Pinia 的 API 兼容 Vue 2（通过 `@vue/composition-api`）和 Vue 3，迁移路径比较平滑。
