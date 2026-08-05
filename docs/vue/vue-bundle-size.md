# Vue3 为什么比 Vue2 打包体积更小

### Tree-Shaking 支持

Vue3 采用 ES Module 格式发布，天然支持 Tree-Shaking。打包工具（如 Webpack、Rollup、Vite）在构建阶段通过静态分析 `import` / `export` 语句，可以精确判断哪些代码被实际引用，未被引用的部分会在最终产物中被剔除。

Vue2 发布的是 UMD 格式的产物。UMD 的设计目标是同时兼容 CommonJS 和 AMD，它的模块边界在运行时才解析，打包工具无法在编译阶段安全地剔除未使用代码。因此即使项目只用到了 Vue 的一小部分 API，整个运行时代码都会被打进去。

关于几种模块格式的区别：

| 格式 | 环境 | 导入/导出 | 加载机制 |
|------|------|----------|---------|
| CommonJS | Node.js | `require` / `module.exports` | 运行时加载，同步 |
| AMD | 浏览器 | `define` / `require` | 运行时加载，异步 |
| UMD | 浏览器 + Node.js | 兼容 CommonJS 和 AMD | 运行时加载 |
| ES Module | 浏览器 + Node.js | `export` / `import` | 编译时加载，异步，支持 Tree-Shaking |

CommonJS 的同步加载在服务端是合理的——模块文件在本地磁盘，读取速度很快。但在浏览器端，同步加载意味着网络请求期间会阻塞页面渲染，所以 AMD 和 ES Module 都采用异步加载。

### 核心代码重写

Vue3 用 TypeScript 重写了全部核心逻辑，代码结构更紧凑。以响应式系统为例：Vue2 基于 `Object.defineProperty` 的实现需要递归遍历对象的所有属性，初始化阶段就要完成全部劫持；Vue3 基于 `Proxy` 的实现按需代理，同等功能所需代码量更少，同时去掉了 `$set`、`$delete` 等补充 API。

### 按需引入

Vue3 的 Composition API 天然支持按需引入。从 `vue` 中直接导入所需函数即可：

```js
import { ref, computed, watch } from 'vue'
```

只有被 `import` 的 API 会出现在最终打包产物中。类似地，第三方 UI 组件库（如 Element Plus）也采用 ES Module 导出，配合支持 Tree-Shaking 的构建工具，可以做到只打包实际使用的组件：

```js
import { Button, Dialog } from 'element-plus'
```

Vue2 的按需引入依赖插件（如 `babel-plugin-component`）在编译阶段做导入路径转换，配置相对复杂，且容易因配置遗漏引入额外的代码。

### 对比 Vue2 的体积下降

三项优化叠加后，一个最小 Vue3 项目的运行时体积相比 Vue2 可以减少约 40%。Tree-Shaking 决定产物基线，核心代码重写降低单位功能的代码量，按需引入确保只携带项目实际使用的部分。
