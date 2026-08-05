# Vue Router 的导航守卫

### 导航守卫是什么

导航守卫是 Vue Router 提供的钩子函数，在路由跳转的不同阶段执行，可以用来拦截、放行或重定向导航。可以把它们理解为路由级别的"中间件"——在进入目标页面前执行一系列检查，只有检查通过才真正完成跳转。

### 三种守卫类型

Vue Router 的导航守卫按作用范围分为三类：

**全局守卫**：挂载在 `router` 实例上，对所有路由生效。

```js
const router = createRouter({ ... })

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  document.title = to.meta.title || '默认标题'
})
```

**路由守卫**：在路由配置中定义，只对特定路由生效。

```js
const routes = [
  {
    path: '/admin',
    component: AdminPage,
    beforeEnter: (to, from, next) => {
      // 只有进入 /admin 时触发
      next()
    }
  }
]
```

**组件内守卫**：在组件内部定义，与组件生命周期绑定。

```js
export default {
  beforeRouteEnter(to, from, next) {
    // 组件实例尚未创建，无法访问 this
    next(vm => {
      // vm 是组件实例
    })
  },
  beforeRouteUpdate(to, from) {
    // 路由参数变化但组件被复用时触发
  },
  beforeRouteLeave(to, from) {
    // 离开当前路由前触发，常用于表单未保存的提示
    const answer = window.confirm('有未保存的修改，确定离开吗？')
    if (!answer) return false
  }
}
```

### 完整的导航解析流程

当一次路由跳转发生时，守卫的执行顺序是固定的：

1. `beforeRouteLeave` —— 离开组件内的守卫最先触发
2. `beforeEach` —— 全局前置守卫
3. `beforeRouteUpdate` —— 如果组件被复用（如 `/user/1` → `/user/2`）
4. `beforeEnter` —— 路由配置中的守卫
5. `beforeRouteEnter` —— 进入组件内的守卫
6. `beforeResolve` —— 全局解析守卫（Vue Router 4 新增）
7. `afterEach` —— 全局后置钩子，不接受 `next`，导航已确认

理解这个顺序对于调试权限校验逻辑很重要。如果在 `beforeEach` 中做了登录拦截，但组件内 `beforeRouteEnter` 又做了一遍检查，就需要判断是否有必要保留双重校验。

### next 的变迁

Vue Router 3 中守卫必须调用 `next()` 来决定导航走向，不调用则会挂起。Vue Router 4 做了简化——`next` 不再是必选参数。如果守卫没有返回值且不调用 `next`，导航默认放行；返回 `false` 则取消导航；返回路径字符串或对象则重定向。

这种设计降低了遗漏 `next()` 导致路由卡死的风险，但迁移老项目时需要注意兼容性。
