# script 标签 async 和 defer 的区别

## 简介

`async` 和 `defer` 是 script 标签的两个属性，都用来异步加载 JS。但它们下载时机和执行时机完全不同，搞混了很可能出 bug——比如脚本加载顺序不对、DOM 还没生成就去操作节点。

## 核心概念

### 三种模式对比

**普通 script（无属性）**

```html
<script src="heavy.js"></script>
```

浏览器解析 HTML 到 script 标签时，会停下来去下载并执行 JS，等脚本跑完了才继续解析后面的 HTML。如果脚本很大或者网不好，用户看到的就是白屏——这就是"阻塞渲染"。

**defer**

```html
<script src="a.js" defer></script>
<script src="b.js" defer></script>
```

下载和 HTML 解析同时进行，脚本在 **DOM 解析完成后、DOMContentLoaded 之前** 按顺序执行。`a.js` 一定在 `b.js` 之前跑，不管哪个先下载完。

**async**

```html
<script src="a.js" async></script>
<script src="b.js" async></script>
```

下载和 HTML 解析同时进行，但脚本**一下载完就立刻执行**，不管 HTML 有没有解析完，也不管其他脚本。执行顺序不确定——谁先下载完谁先跑。`b.js` 可能在 `a.js` 之前执行。

### 一张更直观的对比

```js
// defer: 不阻塞解析 + 保证执行顺序 + DOM 已就绪
// async: 不阻塞解析 + 不保证执行顺序 + DOM 不一定就绪
// 普通:  阻塞解析 + 保证执行顺序 + DOM 不一定就绪（后面的 DOM 还没解析）
```

### 几个容易踩的坑

**async 脚本里别操作 DOM：**

```js
// a.js (async 加载)
document.getElementById('app') // 可能是 null，HTML 还没解析到 #app
```

**模块脚本默认 defer：**

```html
<script type="module" src="app.js"></script>
<!-- 等价于 -->
<script type="module" src="app.js" defer></script>
```

用 type="module" 时不需要再手动加 defer——它默认就是 defer 行为。

**动态插入的脚本默认 async：**

```js
const script = document.createElement('script')
script.src = 'analytics.js'
document.head.appendChild(script) // 默认按 async 执行
```

如果想让它按顺序执行：

```js
const script = document.createElement('script')
script.src = 'dependency.js'
script.async = false  // 明确禁掉 async
document.head.appendChild(script)
```

## 实战场景

选哪种取决于你对执行顺序和 DOM 就绪状态的要求：

- **有依赖关系 + 需要 DOM**：`defer`。比如先加载 jQuery 再加载依赖 jQuery 的业务代码。
- **完全独立 + 不关心 DOM**：`async`。比如统计脚本、广告 SDK、第三方挂件。
- **必须等脚本跑完才能渲染页面**：不加属性，放在 `<head>` 里。但这种情况现在很少这么做，更多是加个 loading 态等 DOM 就绪。

## 总结

`defer` 保证顺序和 DOM 就绪，适合有依赖的脚本。`async` 最快但顺序随机、DOM 不一定就绪，适合独立脚本。一句话口诀：**defer 延迟到 DOM 就绪按序执行，async 一下载完就跑**。
