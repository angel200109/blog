# setTimeout 倒计时 vs setInterval 的区别


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

