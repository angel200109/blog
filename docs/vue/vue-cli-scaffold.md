# Vue 项目脚手架：从 Vue CLI 到 create-vue

### 为什么需要脚手架

直接在 HTML 中用 `<script>` 引入 Vue CDN 确实能跑起来，但在实际项目中这样做会很快遇到瓶颈：

- 无法使用单文件组件（`.vue`），所有逻辑、模板和样式挤在一起
- 不支持 TypeScript 和现代 ES 语法（需要手动配置 Babel）
- 缺乏热更新，每次修改都要手动刷新浏览器
- 缺乏代码分割和打包优化，首屏加载体积不可控
- 无法统一管理项目结构、lint 规则和测试框架

脚手架的价值在于把上述配置工作标准化：一条命令就能生成一个已经配好 Webpack/Vite、Babel、TypeScript、ESLint、路由、状态管理的项目骨架，开发者可以直接开始写业务代码。

### Vue CLI

Vue CLI 是 Vue 2 时代的官方脚手架，底层基于 Webpack。它的特点是生态成熟、插件体系丰富。安装后通过 `vue create` 交互式选择项目配置：

```bash
npm install -g @vue/cli
vue create my-project
```

Vue CLI 会在创建过程中让开发者选择 Vue 版本、是否使用 TypeScript、CSS 预处理器、测试框架、ESLint 等，最终生成一个完整的项目模板。项目结构包括了 `src/`、`public/`、`vue.config.js` 等标准目录和文件。

Webpack 的缺点在于开发和构建速度——随着项目规模增长，冷启动和热更新会逐渐变慢。尽管 Vue CLI 通过 DLL 预编译、缓存等手段做了优化，但底层架构的限制无法完全消除。

### create-vue（Vue 官方推荐）

Vue 3 的官方脚手架从 Vue CLI 转向了基于 Vite 的 `create-vue`：

```bash
npm create vue@latest
```

底层的 Vite 利用了浏览器原生 ES Module 的能力：开发模式下不需要打包，浏览器直接按需加载 `.vue` 和 `.ts` 文件，由 Vite 开发服务器实时编译后返回。配合 esbuild 做预构建（将 CommonJS 模块转为 ESM），冷启动时间从"等十几秒"变成了"几乎瞬间"。

热更新方面，Vite 按需编译，只更新改动的模块，不重新打包整个应用，速度快得多。

### Vue CLI 与 create-vue 的定位关系

`create-vue` 定位为"轻量脚手架"——只提供基础的项目模板和最常用的配置选项，不像 Vue CLI 拥有庞大的插件市场。如果项目需要复杂的 Webpack 配置（比如自定义 loader）、需要使用 Vue 2，或者大量的 Vue CLI 插件生态依赖，Vue CLI 仍然是合理选择。

对于新启动的 Vue 3 项目，官方推荐的路径是使用 `create-vue` + Vite。如果有特殊需求无法满足，可以从这个模板出发手动扩展。
