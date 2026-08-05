# Vuex：Vue.js 的状态管理方案

### Vuex 解决了什么问题

在小项目中，父子组件的通信用 `props` 向下、`$emit` 向上就够用了。但随着项目规模增长，会出现几个棘手的问题：

- 多层级 prop 穿透：用户信息要从顶层组件传到深层子组件，中间每一层都要声明 `props` 再做转发，即使中间的组件根本不关心这个数据。
- 跨组件共享状态：两个没有直接父子关系的组件需要读写同一份数据时，要么把数据提升到共同祖先，要么用事件总线（EventBus），维护成本随组件数量指数上升。
- 状态来源不可追踪：数据散落在各个组件中，出问题时不容易定位"谁改了它"、"什么时候改的"、"改成了什么"。

Vuex 采用集中式存储，将应用的所有共享状态统一管理在一个 store 中，组件不再各自持有状态，而是从 store 读取、通过 store 修改。其底层遵循 Flux 模式的三条核心约束：单一数据源、状态只读、通过纯函数修改状态。

### 五核心概念

**state**：存储数据的地方，等同于组件的 `data`，但从局部提升到了全局。组件通过 `this.$store.state.xxx` 或 `mapState` 辅助函数读取。

```js
const store = new Vuex.Store({
  state: {
    userInfo: null,
    isLoggedIn: false
  }
})
```

**getters**：store 的计算属性，对 state 做派生计算并自动缓存。当依赖的 state 不变时，重复调用 getters 不会重复执行。

```js
getters: {
  activeUsers: state => state.users.filter(u => u.status === 'active')
}
```

**mutations**：唯一能修改 state 的入口，必须是同步函数。这个约束是为了让状态变更可预测、可追踪——DevTools 可以记录每一次 mutation 的快照。

```js
mutations: {
  setUserInfo(state, payload) {
    state.userInfo = payload
  }
}
// 调用方式
this.$store.commit('setUserInfo', userData)
```

**actions**：处理异步逻辑（API 请求、定时器），内部通过 `commit` 来调用 mutations。actions 不直接修改 state，而是把异步工作做完后交给 mutations 做最终的修改。

```js
actions: {
  async fetchUserInfo({ commit }) {
    const data = await api.getUserInfo()
    commit('setUserInfo', data)
  }
}
// 调用方式
this.$store.dispatch('fetchUserInfo')
```

**modules**：当 store 膨胀到一定程度时，用 modules 按业务域拆分。每个 module 拥有独立的 state、getters、mutations 和 actions，默认情况下 module 的 mutations 和 actions 会注册到全局命名空间，开启 `namespaced: true` 后则隔离。

```js
const userModule = {
  namespaced: true,
  state: () => ({ profile: null }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: { user: userModule }
})

// 访问：store.state.user.profile
// 调用：store.dispatch('user/updateProfile')
```

### 数据流转的全过程

一条完整的数据流是这样的：组件通过 `dispatch` 触发 action → action 执行异步操作后通过 `commit` 提交 mutation → mutation 同步修改 state → state 变化触发使用该数据的组件重新渲染。整个链路是单向的，每一步都职责明确，这正是 Flux 架构的核心价值。
