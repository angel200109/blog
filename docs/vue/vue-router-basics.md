# vue-router 是什么、能做什么

### 前端路由解决的问题

在传统的多页面应用中，每次导航（点击链接、提交表单）都会向服务器发起一个完整的 HTTP 请求，服务器返回整个 HTML 页面，浏览器刷新重绘。这个模式在 Web App 时代有两个痛点：页面切换有白屏间隔；状态无法在页面前保留。

前端路由通过拦截 URL 变化，在同一张 HTML 页面上动态替换显示的内容，实现"无刷新页面切换"。vue-router 是 Vue 生态中的官方前端路由方案。

### 三个核心组件

vue-router 对外暴露了三个主要 API：

**`<router-view />` —— 路由视图容器**

根据当前 URL 动态渲染匹配的组件：

```vue
<template>
  <div class="app">
    <header>我的应用</header>
    <router-view />
    <!-- 当前 URL 是 /home 时，这里渲染 Home 组件 -->
    <!-- 当前 URL 是 /about 时，这里渲染 About 组件 -->
  </div>
</template>
```

一个 Vue 项目可以有多个 `<router-view />`，支持两种多视图场景：

- **嵌套路由**：在子路由的组件中再放一个 `<router-view />`，形成层级关系。比如 `/user/profile` 页面中，外层渲染 `User` 组件，内层渲染 `UserProfile` 组件。
- **命名视图**：给 `<router-view name="sidebar" />` 命名，在路由配置中指定 `components` 对应不同名字的视图，实现同级并列的多个动态区域。

**`<router-link />` —— 声明式导航**

替代传统的 `<a>` 标签，点击时触发路由跳转而不刷新页面：

```vue
<router-link to="/home">首页</router-link>
<router-link :to="{ name: 'user', params: { id: 42 } }">用户详情</router-link>
```

`<a>` 标签会发起 HTTP 请求、刷新页面；`<router-link>` 只更新 URL 并替换 `<router-view />` 的内容，不会重新请求 HTML。

**编程式导航 —— `router.push()`**

在 JavaScript 中控制路由跳转：

```javascript
// 登录成功后跳转到首页
this.$router.push("/dashboard");

// 带参数跳转
this.$router.push({ name: "post", params: { id: postId } });

// 返回上一页
this.$router.go(-1);
```

`router.push` 向浏览器的历史记录栈中添加一项，用户可以通过浏览器的后退按钮返回。如果需要替换当前历史记录（不让用户后退到此页），可以用 `router.replace`。

### 路由守卫：导航的权限控制

vue-router 提供全局守卫、路由独享守卫和组件内守卫三个层级的拦截能力：

```javascript
// 全局前置守卫——最常用于登录鉴权
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next("/login"); // 未登录 → 跳转到登录页
  } else {
    next();         // 放行
  }
});
```

守卫的执行顺序是从外到内、从全局到组件：`beforeEach` → `beforeEnter`（路由配置） → `beforeRouteEnter`（组件内）。完整的守卫体系还包括 `beforeResolve`（解析守卫）和 `afterEach`（后置钩子，不能阻断导航）。

### 路由懒加载

默认情况下，所有路由组件会在应用加载时一并打包进主 bundle。当组件数量增加时，首屏加载时间会显著变长。

vue-router 支持动态导入实现懒加载——只在访问对应路由时才请求对应的组件代码：

```javascript
const routes = [
  {
    path: "/dashboard",
    component: () => import("./views/Dashboard.vue"),
  },
  {
    path: "/settings",
    component: () => import("./views/Settings.vue"),
  },
];
```

构建工具（Vite/Webpack）会将每个 `import()` 调用拆分为独立的 chunk 文件。用户访问首页时，只加载首页的代码；切换到 `/dashboard` 时，再按需加载 `Dashboard` 组件的 chunk。

### keep-alive 缓存组件状态

在 `<router-view />` 外层包裹 `<keep-alive>`，可以让被替换掉的组件不被销毁，保留其状态：

```vue
<keep-alive>
  <router-view />
</keep-alive>
```

典型场景是标签页切换——用户在"全部订单"和"待付款"两个列表页之间切换时，不需要每次都重新加载数据，表单的填写状态也不会丢失。配合 `activated` / `deactivated` 钩子可以控制缓存组件的生命周期行为。
