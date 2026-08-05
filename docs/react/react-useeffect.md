# useEffect：管理函数组件中的副作用

### 为什么需要 useEffect

React 函数组件的核心职责是"将 props 和 state 转换为 UI"。但真实应用无法回避渲染之外的操作——请求数据、订阅事件、操作 DOM、设置定时器。这些与 UI 渲染无直接关联的逻辑称为"副作用"（Side Effect）。

`useEffect` 在组件渲染完成后执行副作用逻辑，并且可以按需指定触发条件。

### 执行时机与依赖数组

```jsx
import { useState, useEffect } from "react";

function App() {
  console.log("*** 组件渲染 ***");
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("--- 副作用执行 ---");
    console.log(`当前页码: ${page}`);
    console.log(document.querySelector("h1")); // DOM 已挂载，可安全访问
  }, [page]);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>count +1</button>
      <h2>页码: {page}</h2>
      <button onClick={() => setPage((p) => p + 1)}>翻页</button>
    </div>
  );
}
```

从控制台输出可以看到执行顺序：`组件渲染` → `副作用执行`。`useEffect` 的回调在浏览器完成布局和绘制之后才运行，因此可以安全地访问已挂载的 DOM 节点。

第二个参数——依赖数组——决定了副作用的触发策略：

| 依赖数组 | 触发时机 |
|----------|---------|
| 不传 | 每次渲染后都执行 |
| `[]`（空数组） | 仅在首次渲染（挂载）后执行一次 |
| `[page]` | 首次渲染后 + `page` 变更后执行 |
| `[page, count]` | 任一依赖变更后执行 |

上面的例子中，点击 `count +1` 不会触发副作用——因为 `page` 没变。点击翻页按钮才会触发。这种按需执行避免了无关状态变更带来的额外开销。

### 清理函数

`useEffect` 的回调可以返回一个函数，React 在两个时机执行它：

1. **组件卸载前**，用于释放资源（清除定时器、取消订阅、断开连接）
2. **下一次副作用执行前**，先运行上一次的清理函数，避免累积

```jsx
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("--- 副作用执行 ---");
    // 挂载时的初始化操作：连接数据源、添加事件监听、启动定时器
    const timerId = setInterval(() => {
      console.log("定时任务运行中");
    }, 1000);

    // 清理函数：组件卸载或下次副作用执行前调用
    return () => {
      console.log("~~~ 清理中 ~~~");
      clearInterval(timerId);
      // 断开连接、移除事件监听
    };
  });

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>加 1</button>
    </div>
  );
}
```

每次点击按钮触发重渲染后，控制台的输出顺序是：`组件渲染` → `~~~ 清理中 ~~~` → `--- 副作用执行 ---`。React 先运行上一次副作用的清理逻辑，再执行新的副作用，保证两次副作用之间不会残留上次的资源。

### useEffect 不能直接使用 async

`useEffect` 的回调函数如果被 `async` 修饰，会隐式返回一个 Promise 对象。但 React 要求清理函数只能是 `undefined` 或者一个函数——返回 Promise 会在严格模式下触发警告。

```jsx
// ❌ 错误：async 让回调返回 Promise
useEffect(async () => {
  const data = await fetchUserList();
  setUserList(data);
}, []);

// ✅ 正确：在内部定义一个 async 函数并调用
useEffect(() => {
  async function loadUsers() {
    const data = await fetchUserList();
    setUserList(data);
  }
  loadUsers();
}, []);
```

外层回调保持同步，内部的异步函数独立执行。这种写法也便于在清理函数中取消请求（如使用 `AbortController`）。

### 副作用与渲染的时序关系

`useEffect` 在渲染提交到屏幕后才执行，这意味着：

- 副作用中的 DOM 操作不会阻塞浏览器绘制，用户首先看到的是渲染后的干净界面。
- 如果副作用中修改了状态，会触发额外的渲染——对用户来说可能表现为一次"闪烁"。对于需要在渲染前同步执行的操作（如测量 DOM 并同步修改），应使用 `useLayoutEffect`。

`useEffect` 不阻塞渲染的特性使它适合大多数场景：数据请求、订阅、日志、第三方库初始化。只有确实需要在浏览器绘制前同步执行的副作用才需要 `useLayoutEffect`。
