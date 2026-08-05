# useContext：跨组件共享数据

### 深层 props 传递的问题

组件树中，当数据需要从顶层传到深层子组件时，逐层透传 props 会让中间组件被迫接收与自己无关的数据，增加维护成本。

```jsx
// 子组件
function Child({ count, onHandleAdd }) {
  return (
    <>
      <h3>count: {count}</h3>
      <button onClick={onHandleAdd}>+1</button>
    </>
  );
}

// 父组件——只为透传 props，本身并不使用 count
function Parent({ count, onHandleAdd }) {
  return (
    <>
      <h2>count: {count}</h2>
      <Child count={count} onHandleAdd={onHandleAdd} />
    </>
  );
}

// 根组件
function App() {
  const [count, setCount] = useState(0);
  function handleAdd() {
    setCount((prev) => prev + 1);
  }
  return (
    <div>
      <h1>count: {count}</h1>
      <Parent count={count} onHandleAdd={handleAdd} />
    </div>
  );
}
```

`Parent` 本身不需要 `count` 和 `onHandleAdd`，但为了传给 `Child`，它的 props 列表被无关数据污染。层级越深，这种模式越难维护——每一层中间组件都会成为"传话筒"。

### createContext 与 Provider

React 通过 Context 机制解决这个问题：在组件树外部创建上下文对象，在顶层用 `Provider` 注入数据，任意深度的子组件通过 `useContext` 直接读取。

```jsx
import { createContext, useContext, useState } from "react";

// 1. 创建上下文对象
const CountContext = createContext();

// 子组件——直接从 Context 读取
function Child() {
  const { count, handleAdd } = useContext(CountContext);
  return (
    <>
      <h3>count: {count}</h3>
      <button onClick={handleAdd}>+1</button>
    </>
  );
}

// 父组件——不再需要接收和透传 props
function Parent() {
  const { count } = useContext(CountContext);
  return (
    <>
      <h2>count: {count}</h2>
      <Child />
    </>
  );
}

// 根组件——通过 Provider 注入数据
function App() {
  const [count, setCount] = useState(0);
  function handleAdd() {
    setCount((prev) => prev + 1);
  }
  return (
    <CountContext.Provider value={{ count, handleAdd }}>
      <h1>count: {count}</h1>
      <Parent />
    </CountContext.Provider>
  );
}
```

三步走：`createContext` 创建上下文对象 → `Provider` 的 `value` 注入数据 → 子组件用 `useContext` 消费。`Parent` 的 props 列表被清空，中间层彻底解耦。

### 订阅-发布的工作机制

Context 本质上是一套"订阅-发布"模型。`createContext` 返回的对象内部维护了一个订阅者列表；当 `Provider` 的 `value` 发生变化时，React 会通知所有使用该 Context 的组件重新渲染。

这里有一个常见的误判：Context 是"精准推送"而不是"全局广播"。只有被该 Context 的 `Provider` 包裹且内部调用了 `useContext` 的组件，才会收到更新通知。组件树中不在 Provider 子树内的组件不受影响。

### Provider value 与重渲染边界

Context 的订阅粒度是整个 `value` 对象，而非其中的某个字段。当 `Provider` 的 `value` 发生变化时，所有消费该 Context 的组件都会重新渲染，即使某个组件只依赖 `value` 中的一小部分字段。

上例中 `value={{ count, handleAdd }}` 是一个字面量对象，每次 `App` 渲染都会创建新的引用。这意味着即使 `count` 数值没变，只要 `App` 重渲染，所有消费者都会跟着重渲染。

对于高频更新或消费者较多的场景，可以用 `useMemo` 稳定 `value` 引用：

```jsx
const contextValue = useMemo(
  () => ({ count, handleAdd }),
  [count, handleAdd]
);

<CountContext.Provider value={contextValue}>
```

这样只有当 `count` 或 `handleAdd` 真正变化时，`value` 才会更新引用。

### Context 适合什么场景

Context 解决的是"跨层级共享数据"的问题，但不是全局状态管理的替代品：

| 场景 | 方案 |
|------|------|
| 数据只在父子间传递 1~2 层 | props 即可 |
| 主题、语言、认证信息等低频变更的全局数据 | Context |
| 组件子树内的局部共享（如表单字段、列表选中项） | Context（子树 Provider） |
| 复杂状态逻辑（多 reducer、中间件、跨组件异步更新） | Zustand / Redux Toolkit |
| 需要按字段粒度订阅，避免无关重渲染 | 外部状态管理库 |

关键判断标准：当状态变更频率低、消费者范围明确、逻辑简单时，Context 是内聚性较好的选择；一旦状态逻辑开始膨胀，就应该迁移到专用状态管理方案。
