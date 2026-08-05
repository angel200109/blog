# 前端路由的实现原理

### 多页应用 vs 单页应用的路由

传统的多页应用（MPA）中，每次点击链接都会触发完整的页面刷新：浏览器向服务器发起 HTTP 请求，服务器返回新的 HTML 文档，浏览器重新解析、渲染。路由的职责完全在服务端——URL 对应一个真实的文件路径或服务端渲染的逻辑。

单页应用（SPA）的路由由前端接管。整个应用只有一个 HTML 页面（`index.html`），URL 的变化不再触发页面刷新，而是由前端路由库拦截 URL 变化，根据规则切换对应的视图组件。

### 为什么需要前端路由

前端路由解决的核心问题是：在单页应用中模拟多页的导航体验。具体来说：

- **保持浏览器的前进/后退能力**：用户期望点击浏览器的返回按钮能回到上一个页面，如果 SPA 不处理路由，这就会失效。
- **支持直接访问和刷新**：用户可能直接访问 `/about` 这个地址，而不是从首页点击进去。前端路由需要正确处理这种"深层链接"。
- **按需加载组件**：路由可以把不同页面的代码拆分成独立的 chunk，按需加载，减小首屏包体积。

### 三种实现方式

**hash 实现**：利用 URL 中 `#` 后面的部分。修改 hash 不会触发页面刷新，通过 `hashchange` 事件监听变化。

```js
window.addEventListener('hashchange', () => {
  const path = location.hash.slice(1) // 去掉 '#'
  renderComponent(path)
})
```

**history 实现**：利用 HTML5 History API，通过 `pushState` 和 `replaceState` 修改地址而不刷新页面，通过 `popstate` 监听浏览器的前进后退。

```js
// 劫持所有的 <a> 点击，阻止默认跳转
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    e.preventDefault()
    const path = e.target.getAttribute('href')
    history.pushState(null, '', path)
    renderComponent(path)
  }
})

window.addEventListener('popstate', () => {
  renderComponent(location.pathname)
})
```

**memory 实现**：不修改 URL，路由状态完全保存在内存中。适用于非浏览器环境（如 React Native）或嵌入在 iframe 中的场景。这种方式最简单，但失去了 URL 带来的可分享性和刷新支持。

### 前端路由与服务端路由的协作

即使是纯前端路由，服务端仍然承担一个关键职责：对 `history` 模式的 SPA，必须将所有路径的请求都指向 `index.html`，由前端接管分发。这一般通过在 Nginx 中配置 `try_files` 或 Node.js 服务器中设置 fallback 中间件来实现。

对于需要 SEO 的 SPA，通常还需要引入服务端渲染（SSR）或预渲染，让搜索引擎爬虫能拿到完整的页面内容，而不是一个空壳 HTML。
