# useCallback 与 useMemo：缓存函数与计算结果

### 函数组件中"每次渲染都是新的"

函数组件的本质是每次渲染都重新执行整个函数体。这意味着内部定义的变量、对象、数组、函数，在两次渲染之间是全新的实例：

```jsx
function App() {
  const [count, setCount] = useState(0);

  const fetchData = () => {
    fetch(`/api/user?page=${count}`);
  }; // 每次渲染都是新的函数引用

  return <UserList onRefresh={fetchData} count={count} />;
}
```

大多数情况下这不会造成问题——JavaScript 引擎的垃圾回收机制会处理掉旧实例。但当这些引用作为 props 传给 `React.memo` 包裹的子组件，或者作为 `useEffect` 等 Hook 的依赖时，不稳定的引用会导致子组件无法跳过重渲染，或者副作用频繁触发。

`useCallback` 和 `useMemo` 解决的就是这个问题：在多次渲染之间缓存引用，只在真正的依赖变更时才重新创建。

### useCallback：缓存函数引用

```jsx
import { useCallback } from "react";

function ProductPage({ productId, referrer, theme }) {
  // handleSubmit 在 productId 或 referrer 变化前始终是同一个引用
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/checkout", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

`useCallback` 接收两个参数：要缓存的函数和依赖数组。只要依赖数组中的值不变，返回的函数引用就不变。这层缓存使得 `ShippingForm` 在 `theme` 变化时不会因为 `handleSubmit` 引用变化而重渲染（前提是 `ShippingForm` 被 `React.memo` 包裹）。

注意 `useCallback` 缓存的是引用而不是调用结果。它的返回值仍然是一个函数，可以直接调用。当依赖数组为空 `[]` 时，函数引用在组件的整个生命周期中保持不变。

### useMemo：缓存计算结果

```jsx
import { useState, useMemo } from "react";

function Dashboard() {
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  // 只有 y 变化时才重新执行计算
  const result = useMemo(() => {
    console.log("🧮 执行计算");
    let sum = 0;
    for (let i = 0; i < 100000000; i++) {
      sum += y;
    }
    return sum;
  }, [y]);

  return (
    <div>
      <h2>x: {x}</h2>
      <h2>y: {y}</h2>
      <h2>计算结果: {result}</h2>
      <button onClick={() => setX(x + 1)}>增加 x（不触发计算）</button>
      <button onClick={() => setY(y + 1)}>增加 y（触发计算）</button>
    </div>
  );
}
```

`useMemo` 在依赖不变时跳过内部函数的执行，直接返回上次缓存的值。点击"增加 x"按钮时，`y` 没变，`useMemo` 不会重新计算——控制台不会输出"执行计算"。点击"增加 y"按钮时才触发重算。

与 `useCallback` 不同，`useMemo` 缓存的是函数调用的返回值，不仅仅是引用。依赖数组必须写，否则每次渲染都会重新计算，完全失去缓存意义。

### useCallback 与 useMemo 的关系

`useCallback(fn, deps)` 本质上等价于 `useMemo(() => fn, deps)`。两者都是缓存策略的不同包装：

| | useCallback | useMemo |
|--------|-------------|---------|
| 缓存对象 | 函数引用 | 任意值（计算结果） |
| 返回类型 | 函数本身 | 内部函数的返回值 |
| 典型场景 | 传给子组件的回调函数 | 昂贵计算、派生数据、稳定对象引用 |

在配合 `React.memo` 的场景中，两者常常一起使用：`useMemo` 稳定数据引用，`useCallback` 稳定回调引用，`React.memo` 接收稳定的 props 后即可跳过渲染。

### 什么时候不需要 useCallback / useMemo

缓存本身也有成本——React 需要维护依赖数组和缓存值，每次渲染都要做依赖比较。以下场景中不推荐使用：

- **渲染成本极低的子组件**：`memo` 的浅比较开销可能大于直接渲染。
- **依赖频繁变化**：如果依赖每次渲染都会变，缓存永远不会命中，徒增开销。
- **不传给子组件或不作为 Hook 依赖**：只在本组件内部使用的函数/变量，没有缓存必要。
- **计算本身很廉价**：对简单算术、字符串拼接使用 `useMemo` 属于过度优化。

一个实用的判断标准：如果不用 `useCallback`/`useMemo` 时，通过 React DevTools Profiler 能观察到明显的性能瓶颈（如列表项反复渲染），再考虑加入缓存。不要把它们当成"防御性编程"的默认操作——没有度量就没有优化。
