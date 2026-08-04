# Vue 响应式原理

### 四个核心角色

Vue 的响应式系统是**数据劫持 + 发布订阅模式**，由四个角色配合完成：Observer、Dep、Watcher、Compile。

**Observer（观察者）**：把普通对象/数据通过 `Object.defineProperty`（Vue2）或 `Proxy`（Vue3）变成响应式数据。数据被读时触发 get，被写时触发 set。

**Dep（依赖管理器）**：为每个响应式属性维护一个订阅者列表，里面存的是所有依赖这个属性的 Watcher。就像一个微信群，数据变了就在群里通知所有人。

**Watcher（订阅者）**：数据变了要干嘛的具体执行者。每个组件的 render 函数对应一个 Watcher，数据更新时 Dep 通知它"你依赖的数据变了，重新干活"。

**Compile（编译器）**：解析模板中的 `{{ }}`、`v-model` 等指令，把它们替换成真实数据，同时为每个用到数据的地方创建 Watcher。

### 一个完整的数据更新流程

假设你在模板里写了 `{{ count }}`，count 的初始值是 0：

1. **初始化阶段**：Compile 解析模板，发现用了 `count`，创建一个 Watcher
2. **依赖收集**：Watcher 第一次执行时读取 `count`，触发 get 拦截 → Dep 把这个 Watcher 收进自己的订阅名单
3. **数据变化**：`count = 1`，触发 set 拦截 → Dep 通知名单里所有 Watcher："数据变了"
4. **视图更新**：Watcher 收到通知，重新执行 render → 生成新虚拟 DOM → Diff → 更新真实 DOM

### Vue2 vs Vue3 的差异

Vue2 用 `Object.defineProperty` 逐个劫持属性，有两个硬伤：新增/删除属性感知不到（所以才有 `$set` / `$delete`），数组下标修改感知不到（需要重写 push/pop 等 7 个方法）。

Vue3 换 `Proxy` 后，直接代理整个对象，新增属性、删除属性、数组下标修改全都能拦截，而且不需要初始化时递归遍历所有属性（按需代理），初始化性能提升明显。
