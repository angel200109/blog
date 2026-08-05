# Vue Router hash 模式与 history 模式的区别

### hash 模式的工作原理

hash 模式下的 URL 带有一个 `#` 符号，比如 `http://example.com/#/home`。`#` 及之后的部分不会发送给服务器，完全由浏览器本地处理。Vue Router 通过监听 `hashchange` 事件来感知路由变化，切换对应的组件。

hash 模式最大的优势是兼容性好，不需要服务端做任何配置。把打包好的静态文件往任意服务器一放就能跑，不用担心刷新 404。

但代价是 URL 不够美观，而且 `#` 在分享链接、SEO 等场景下不理想。另外，`#` 后面的内容无法参与 HTTP 请求，某些依赖锚点的逻辑需要额外处理。

### history 模式的工作原理

history 模式利用 HTML5 的 `pushState()` 和 `replaceState()` API 来修改浏览器地址栏，不再依赖 `#`，URL 看起来和正常的多页网站一样：`http://example.com/home`。

路由变化时，Vue Router 使用 `popstate` 事件感知浏览器的前进/后退操作，而 `pushState` / `replaceState` 本身不会触发 `popstate`。Vue Router 在前端内部维护了一套路由栈，手动调用 `router.push()` 或 `<router-link>` 时直接更新地址栏并渲染对应组件。

history 模式的致命弱点是刷新页面时，浏览器会向服务器请求当前 URL 对应的资源。如果服务端没有处理 fallback（比如 Nginx 把所有路径都指向 `index.html`），就会返回 404。

### 关键差异对比

| 维度 | hash 模式 | history 模式 |
|------|----------|-------------|
| URL 形态 | `/#/home` | `/home` |
| 服务端依赖 | 不需要 | 需要 fallback 配置 |
| 实现机制 | `hashchange` 事件 | `pushState` + `popstate` 事件 |
| 兼容性 | IE10+ | IE10+ |
| SEO | 差（`#` 后内容不参与抓取） | 好（前提是服务端渲染配合） |
| 部署复杂度 | 低 | 中等（需要 Nginx/Apache 配置） |

### 服务端 fallback 配置

history 模式在生产环境常见的 Nginx 配置如下：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

这行配置的含义是：先尝试匹配请求的静态文件，找不到就回退到 `index.html`，由前端路由接管。如果缺少这个配置，用户在 `/about` 页面刷新就会看到一个 404。

### 怎么选

不需要 SEO、部署环境简单（比如 GitHub Pages 不支持配置 Nginx）时，hash 模式是更省心的选择。需要干净 URL 或对 SEO 有要求、服务端配置可控时，使用 history 模式。
