# script 标签 async 和 defer 的区别


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

