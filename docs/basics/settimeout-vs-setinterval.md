# setTimeout 倒计时 vs setInterval 的区别

## 简介

做倒计时或者定时轮询的时候，`setTimeout` 和 `setInterval` 都能用，但它们背后的行为完全不同。选错了可能会遇到时间漂移、回调堆积这些坑。

## 核心概念

### setInterval 的坑

```js
setInterval(() => {
  heavyWork() // 假设执行要 60ms
}, 100)
```

`setInterval` 每 100ms 触发一次。但如果 `heavyWork()` 本身要跑 60ms，下次触发时回调还在执行中，浏览器不会等你——直接丢一个新的回调进队列。等第一个跑完，队列里的马上接着跑，中间几乎没有间隔。这就是回调堆积。

更隐蔽的是：如果主线程在被占用（比如你在滚动页面），积累的多个回调会一口气全弹出来。

### setTimeout 倒计时

```js
function tick() {
  heavyWork()
  setTimeout(tick, 100)
}
tick()
```

`setTimeout` 是等回调执行完了才重新计时，不会堆积。但如果 `heavyWork()` 执行时间不稳定，实际间隔会在 100ms 到 160ms 之间漂——时间长了会不准。

### 怎么做得准

用 `Date.now()` 修正偏移：

```js
function preciseCountdown(duration, onTick, onEnd) {
  const start = Date.now()
  function tick() {
    const elapsed = Date.now() - start
    const remaining = duration - elapsed
    if (remaining <= 0) return onEnd()
    onTick(remaining)
    setTimeout(tick, Math.min(1000, remaining % 1000))
  }
  tick()
}
```

每次根据实际流逝的时间来算还剩多少，而不是盲目用固定间隔。

## 实战场景

- **轮询接口**：用 `setTimeout` 递归，避免请求堆积
- **动画循环**：用 `requestAnimationFrame`（不要用定时器）
- **倒计时 UI**：用 `Date.now()` 修正 + `setTimeout` 递归
- **简单心跳**：`setInterval` 也 OK，只要回调够轻量

## 总结

`setInterval` 简单直接但容易堆积，`setTimeout` 递归更可控。做倒计时记得用时间戳修正偏移，不然用户看着秒数跳来跳去会很困惑。
