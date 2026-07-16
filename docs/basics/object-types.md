# 原生对象、内置对象、宿主对象，傻傻分不清

这三个概念经常被混着用，但它们确实不一样。一句话区分：

- **原生对象**：ECMAScript 规范定义的，比如 `Object`、`Array`、`Function`、`Date`、`RegExp`
- **内置对象**：原生对象里"不用 new 就能用"的那部分，比如 `Math`、`JSON`、`globalThis`
- **宿主对象**：运行环境提供的，比如浏览器里的 `window`、`document`、`console`，Node.js 里的 `process`、`Buffer`

## 原生对象

JS 语言本身带的。按规范，原生对象又分两类：

**构造器类**（可以用 `new` 创建实例）：
`Object`、`Array`、`Function`、`Date`、`RegExp`、`String`、`Number`、`Boolean`、`Error`、`Map`、`Set`、`Promise`……

**非构造器类**（直接用，不能 `new`）：
`Math`、`JSON`、`Reflect`、`Proxy`（好吧 Proxy 确实用 `new`）……

## 内置对象

ECMAScript 规范里把"不需要显式实例化、全局就能访问的"叫内置对象。`Math` 和 `JSON` 是两个典型——不需要 `new Math()`，直接用。

`globalThis` 也算。在浏览器里它是 `window`，在 Node.js 里它是 `global`，在 Worker 里它是 `self`。ES2020 统一成了 `globalThis`。

## 宿主对象

这取决于运行环境。浏览器的宿主对象就是 Web API 那套东西：

- DOM：`document`、`HTMLElement`、`NodeList`
- BOM：`window`、`location`、`history`、`navigator`
- 其他：`console`、`fetch`、`localStorage`、`setTimeout`

Node.js 的宿主对象是另一套：

- `process`、`Buffer`、`require`、`__dirname`、`__filename`
- `fs`、`http` 等模块提供的对象

注意 `console` 和 `setTimeout` 在 Node 和浏览器里都有，但它们是各自环境的宿主对象，实现细节不同。

## 为什么要分清楚

实际开发中你不会天天纠结这些分类。但理解它们有几个实际意义：

- 做兼容性时知道哪些是 ECMAScript 标准（到处都有）、哪些是宿主环境特有的（IE 可能没有）
- 写同构代码（SSR、跨端）时能判断哪些 API 在 Node 和浏览器里行为不同
- 面试被问到能说清楚，不被概念绕晕
