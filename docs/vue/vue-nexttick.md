# Vue $nextTick 使用与实现

### $nextTick 解决了什么问题

Vue 的 DOM 更新是异步的。当响应式数据发生变化时，Vue 不会立即更新 DOM，而是将更新任务推入一个队列，在同一个事件循环中缓冲所有数据变更，然后在下一次事件循环的微任务阶段统一执行 DOM 更新。

```js
this.message = 'Hello'
console.log(this.$el.textContent) // 仍然是旧值，DOM 还没更新
```

这种批量异步更新策略避免了频繁的 DOM 操作，但对开发者来说带来了一个常见场景：修改数据后需要立即获取更新后的 DOM 状态。`$nextTick` 正是为这个场景设计的。

### 使用方式

`$nextTick` 接收一个回调函数，该回调会在 DOM 更新完成后执行：

```js
this.message = 'Hello'
this.$nextTick(() => {
  console.log(this.$el.textContent) // 'Hello'，DOM 已更新
})
```

`$nextTick` 返回一个 Promise，在 Composition API 中可以直接 `await`：

```js
import { nextTick, ref } from 'vue'

const message = ref('')
const inputRef = ref(null)

async function updateAndFocus() {
  message.value = 'Updated'
  await nextTick()
  inputRef.value?.focus()
}
```

### 实现原理

`$nextTick` 的核心是维护一个回调队列，并利用微任务在 DOM 更新后批量执行队列中的回调。

简化版实现：

```js
const callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  copies.forEach(cb => cb())
}

function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    Promise.resolve().then(flushCallbacks)
  }
}
```

实际实现中，Vue 会优先使用 `Promise.then` 创建微任务，在微任务不支持的环境中降级到 `MutationObserver` 或 `setImmediate`，最终兜底使用 `setTimeout`。

### 执行时序

整个流程的时序如下：

```
数据变更 → 触发 setter → 通知 Watcher
  → Watcher 被推入更新队列（去重）
  → 微任务调度器安排刷新队列
  → 当前同步代码执行完毕
  → 微任务执行：
    1. 遍历 Watcher 队列，执行组件更新 → DOM 更新完成
    2. 遍历 $nextTick 回调队列，依次执行
```

需要特别注意的是，`$nextTick` 的回调是在 DOM 更新完成后执行的，但此时浏览器可能尚未完成渲染（布局和绘制）。如果需要获取更新后的布局信息（如元素尺寸），可以在 `$nextTick` 回调中再套一层 `requestAnimationFrame`。
