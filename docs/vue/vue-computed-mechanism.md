# computed 的缓存与脏检查机制

### computed 不是每次都重新计算

`computed` 的核心价值是缓存——只要依赖的响应式数据没有变化，多次访问计算属性只会返回缓存值，不会重复执行 getter。这一行为的背后是一套"脏检查"机制。

### 脏检查的三个角色

实现一个最小可运行的 `computed` 需要三个部分协同：

**dirty 标记**：一个布尔值，表示当前缓存是否失效。`dirty = true` 意味着下次访问时需要重新计算；`dirty = false` 意味着可以直接返回缓存值。

**依赖追踪**：在 getter 执行期间，自动收集其中访问的响应式数据。这是通过 `effect`（在 Vue2 中叫 `Watcher`）在 getter 执行时触发响应式数据的依赖收集实现的。

**调度器**：当依赖数据变化时，不会立即重新执行 getter，而是通过调度器把 `dirty` 置为 `true`，标记"缓存脏了"，等到下次真正访问 `computed.value` 时才重新计算。

### 流程示意

以下是一个极简版的 `computed` 实现，用于理解核心逻辑（不是 Vue3 的源码）：

```javascript
function computed(getter) {
  let dirty = true;        // 初始标记：需要计算
  let cachedValue;         // 缓存值
  let cleanup;             // 用于取消依赖追踪

  // 响应式数据的依赖发生变化时，将 dirty 置为 true
  const scheduler = () => {
    if (!dirty) {
      dirty = true;
      // 触发 computed 自身依赖的更新（如果有其他 computed 或 watch 依赖它）
    }
  };

  return {
    get value() {
      if (dirty) {
        // 执行 getter，在此期间收集依赖
        // getter 中访问的每个响应式数据都会注册 scheduler
        cachedValue = getter();
        dirty = false;    // 缓存有效
      }
      return cachedValue;
    }
  };
}
```

关键点：数据的 setter 触发后，只是调用了 `scheduler`（将 `dirty` 设为 `true`），并没有立即运行 getter。等到下一次真正读取 `.value` 时，才会检查 `dirty` 并决定是否重新计算。

### 懒执行的代价与收益

这种"标记脏 → 访问时再算"的策略称为**懒执行**。它的收益是：如果一个依赖数据连续变化了 10 次，但模板中这 10 次都没有渲染（比如在同一个同步批处理中），getter 实际上一次都不会被执行。最终只会在模板渲染、真正访问 `computed.value` 时计算一次。

代价是：第一次访问 `computed.value` 需要额外开销（调用 getter），但在应用中后续访问全部走缓存，总体性能远优于每次都重新计算。

### 为什么 computed 不支持异步

Vue 的设计层面做出了明确限制：`computed` 的 getter 必须是同步函数。这并非实现上做不到，而是语义上的约束。

`computed` 的定义是"依赖值变化 → 计算值立即变化"。如果 getter 是异步的：

```javascript
// 假设 computed 支持异步（实际不支持）
const total = computed(async () => {
  const rate = await fetchExchangeRate(); // 异步
  return price.value * quantity.value * rate;
});
```

此时会出现一个灰色窗口：`price` 变了，但 `total` 还没变（因为异步请求还没返回）。这违背了 "computed 是同步派生值" 的基本约定。在这个时间窗口内，任何读取 `total` 的代码都会拿到过期数据。

如果需要异步推导，正确的方案是用 `watch` 监听依赖变化，在回调中执行异步操作后更新一个独立的 `ref`，而不是用 `computed`。

### computed 的可写模式

除了只读的 getter，`computed` 也可以提供一个 setter 实现可写：

```javascript
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const parts = newValue.split(" ");
    firstName.value = parts[0];
    lastName.value = parts[1] || "";
  }
});

fullName.value = "Angel Xia"; // 触发 setter，反向更新 firstName 和 lastName
```

setter 实际上是将对 `computed` 的赋值操作"反向映射"到它所依赖的源数据上——这是一种语法糖，内部逻辑与在 `watch` 中手动反向更新源数据等价。
