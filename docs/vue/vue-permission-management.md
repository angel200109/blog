# Vue 项目的权限管理

### 权限控制的层级

前端权限管理通常分为两个层级：路由权限（页面级别）和按钮权限（操作级别）。两者解决的场景不同，但实现思路上可以复用同一套权限数据。

**路由权限**控制某个用户能否访问特定页面。未授权的路由应该在路由守卫阶段被拦截，而不是等到切换页面后再触发重定向。

**按钮权限**控制页面内某个操作按钮是否显示或是否可点击。它的粒度更细——用户可能被允许查看列表页面，但不被允许点击"新增"按钮。

### 路由权限的实现

核心思路是在路由的 `meta` 字段中声明该页面需要的权限标识，然后在全局前置守卫 `beforeEach` 中校验。

```js
const routes = [
  {
    path: '/admin',
    component: AdminPage,
    meta: { permission: 'admin:access' }
  },
  {
    path: '/orders',
    component: OrderList,
    meta: { permission: 'orders:view' }
  }
]

router.beforeEach(async (to, from, next) => {
  const permissions = await getUserPermissions() // 从接口获取用户权限列表

  if (to.meta.permission && !permissions.includes(to.meta.permission)) {
    next('/403') // 无权限，跳转到 403 页面
  } else {
    next()
  }
})
```

更进一步的方案是动态路由：用户登录后，后端返回其权限列表，前端根据权限列表动态生成路由配置并通过 `router.addRoute()` 注册。未授权的路由根本不会出现在路由表中，从源头杜绝了越权访问的可能。

```js
async function initRouter() {
  const permissions = await fetchPermissions()
  const routes = generateRoutes(permissions)
  routes.forEach(route => router.addRoute(route))
}
```

### 按钮权限的实现

按钮权限的典型实现方案有两种：

**指令方案**：封装一个 `v-permission` 自定义指令，在元素挂载时校验权限，不通过则移除 DOM。

```js
// 注册指令
app.directive('permission', {
  mounted(el, binding) {
    const required = binding.value
    const permissions = usePermissionStore().list
    if (!permissions.includes(required)) {
      el.parentNode?.removeChild(el)
    }
  }
})

// 使用
<button v-permission="'orders:create'">新增订单</button>
```

**函数方案**：导出一个 `hasPermission` 函数，在模板中用 `v-if` 控制。

```js
const can = (permission) => {
  return permissionStore.list.includes(permission)
}

// 使用
<button v-if="can('orders:create')">新增订单</button>
```

指令方案的好处是调用简洁，缺点是元素在挂载后才被移除，存在短暂的闪烁。函数方案不会有闪烁，但模板中会散布大量 `v-if="can('xxx')"`。实际项目中两者可以混用：主要用指令覆盖常规场景，需要更细粒度控制时使用函数方案。

### 权限数据的来源

权限数据不应该硬编码在前端，需要从后端接口获取。常见的做法是用户登录成功后，后端返回权限标识数组或角色信息。前端将这份数据存入 Pinia 或 Vuex store，供全局守卫和权限指令使用。如果权限变更（比如管理员调整了某个用户的角色），可以通过重新登录或主动拉取接口来刷新。
