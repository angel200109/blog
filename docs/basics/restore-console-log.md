# console.log 被重写后怎么恢复


### 重写的常见手段

```js
// 方法 1：直接清空
console.log = function() {}

// 方法 2：代理过滤
const original = console.log
console.log = function(...args) {
  if (args.includes('secret')) return
  original.apply(console, args)
}
```

### 恢复方法一：iframe 大法

如果你还能在当前页面执行任意 JS，最稳的办法是借个新鲜干净的 console：

```js
const iframe = document.createElement('iframe')
iframe.style.display = 'none'
document.body.appendChild(iframe)

const freshConsole = iframe.contentWindow.console
const originalLog = freshConsole.log.bind(freshConsole)

originalLog('这条会正常输出', { data: 123 })

document.body.removeChild(iframe)
```

iframe 是独立上下文，它的 console 对象是原生的，没被重写过。拿到之后 bind 一下，就能在当前页面用了。

### 恢复方法二：从原型链拿

如果只是 `console.log` 这个属性被改了，`console.constructor` 上可能还有备用的：

```js
// 如果是 console 实例的属性被改写
const proto = Object.getPrototypeOf(console)
const descriptor = Object.getOwnPropertyDescriptor(proto, 'log')

if (descriptor && descriptor.value) {
  console.log = descriptor.value.bind(console)
}
```

但这个办法不太靠谱——如果被重写的是 `console` 对象本身（比如在 iframe 隔离环境里），原型链也用不了。

### 恢复方法三：DevTools 上下文切换

打开 DevTools Console，顶部有个下拉框可以选执行上下文（通常是 "top"）。如果 console 在当前 context 被改了，切到 iframe 或扩展的 context 里，那里的 console 还是干净的。

但这个方法只能帮你自己调试，没法让页面上写的脚本恢复正常输出。

