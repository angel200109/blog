# Vue 响应式原理

### 四个核心角色

Vue 的响应式系统是**数据劫持 + 发布订阅模式**，由四个角色配合完成：Observer、Dep、Watcher、Compile。

**Observer（观察者）**：把普通对象/数据通过 `Object.defineProperty`（Vue2）或 `Proxy`（Vue3）变成响应式数据。数据被读时触发 get，被写时触发 set。

**Dep（依赖管理器）**：为每个响应式属性维护一个订阅者列表，列表中保存所有依赖该属性的 Watcher。数据变化时，Dep 会统一通知这些订阅者执行更新。

**Watcher（订阅者）**：负责在数据变化后执行具体更新逻辑。每个组件的 render 函数通常会对应一个 Watcher，数据更新时 Dep 会通知相关 Watcher 重新执行。

**Compile（编译器）**：解析模板中的 `{{ }}`、`v-model` 等指令，把它们替换成真实数据，同时为每个用到数据的地方创建 Watcher。

### 一个完整的数据更新流程

假设模板中使用了 `{{ count }}`，且 count 的初始值为 0：

1. **初始化阶段**：Compile 解析模板，识别到 `count` 被使用，并创建对应 Watcher
2. **依赖收集**：Watcher 第一次执行时读取 `count`，触发 get 拦截 → Dep 将这个 Watcher 记录到订阅列表中
3. **数据变化**：`count = 1`，触发 set 拦截 → Dep 通知订阅列表中的 Watcher
4. **视图更新**：Watcher 收到通知后重新执行 render → 生成新虚拟 DOM → Diff → 更新真实 DOM

### Vue2 vs Vue3 的差异

Vue2 使用 `Object.defineProperty` 逐个劫持属性，存在两个典型限制：新增/删除属性无法自动感知（因此需要 `$set` / `$delete`），数组下标修改也无法直接感知（需要重写 push/pop 等 7 个数组方法）。

Vue3 改用 `Proxy` 后，可以直接代理整个对象，新增属性、删除属性、数组下标修改都能被拦截。同时 Vue3 不需要在初始化阶段递归遍历所有属性，而是按需代理，初始化性能也更好。
