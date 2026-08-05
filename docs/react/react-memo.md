# React.memo：跳过无意义的重渲染

### 父组件更新引发的连锁渲染

React 的默认行为是：父组件重新渲染时，所有子组件都会跟着重新渲染，即使子组件的 props 没有变化。

```jsx
const Child = ({ name }) => {
  console.log("👶 子组件渲染了");
  return <div>子组件: {name}</div>;
};

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>父组件</h1>
      <button onClick={() => setCount(count + 1)}>
        点击增加 count: {count}
      </button>
      <Child name="小明" />
    </div>
  );
}
```

每次点击按钮，`count` 变化导致 `App` 重渲染，`Child` 也跟着渲染——尽管 `name` 始终是 `"小明"`。对于渲染开销较大的子组件（如包含大量列表渲染、复杂计算），这种无意义的连锁渲染会造成性能浪费。

### React.memo 的浅比较机制

`React.memo` 是一个高阶组件，它包裹子组件后，React 会在渲染前对 props 做一次浅比较：如果所有 props 引用都和上一次相同，就跳过该组件的渲染，直接复用上一次的结果。

```jsx
import { memo } from "react";

const Child = memo(({ name }) => {
  console.log("👶 子组件渲染了"); // 父组件重渲染时，这行不再输出
  return <div>子组件: {name}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>父组件</h1>
      <button onClick={() => setCount(count + 1)}>
        点击增加 count: {count}
      </button>
      <Child name="小明" />
    </div>
  );
}
```

用 `memo` 包裹后，`Child` 的 props（`name: "小明"`）在两次渲染间引用相同，React 直接跳过渲染，控制台中不会再输出子组件的渲染日志。

### 引用类型 props 让 memo 失效

浅比较的问题在于：引用类型的值（对象、数组、函数）在每次渲染时都会创建新的实例。即使内容相同，浅比较也会判定它们"变了"，导致 `memo` 失去作用。

```jsx
const Child = memo(({ userList, onUpdate }) => {
  console.log("👶 子组件渲染了");
  onUpdate();
  return <div>用户数: {userList.length}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  const userList = [1, 2, 3, 4, 5]; // 每次渲染都是新数组
  const onUpdate = () => {
    console.log("父组件的更新函数");
  }; // 每次渲染都是新函数

  return (
    <div>
      <h1>父组件</h1>
      <button onClick={() => setCount(count + 1)}>
        点击增加 count: {count}
      </button>
      <Child userList={userList} onUpdate={onUpdate} />
    </div>
  );
}
```

尽管 `userList` 的内容没变，`onUpdate` 的逻辑也没变，但每次渲染它们都是全新的引用，`memo` 的浅比较无法识别它们是"相同的 props"，子组件照旧渲染。

### 用 useMemo 和 useCallback 稳定引用

解决思路是在父组件中缓存引用类型，让它们在重渲染时保持稳定：

```jsx
function App() {
  const [count, setCount] = useState(0);

  // 数据：useMemo 缓存数组引用
  const userList = useMemo(() => [1, 2, 3, 4, 5], []);

  // 函数：useCallback 缓存函数引用
  const onUpdate = useCallback(() => {
    console.log("父组件的更新函数");
  }, []);

  return (
    <div>
      <h1>父组件</h1>
      <button onClick={() => setCount(count + 1)}>
        点击增加 count: {count}
      </button>
      <Child userList={userList} onUpdate={onUpdate} />
    </div>
  );
}
```

`useMemo` 确保 `userList` 在依赖不变时返回同一个数组引用；`useCallback` 对函数做同样的事。此时 `memo` 的浅比较检测到 props 引用未变，子组件不会再重渲染。

### 使用建议

`React.memo` 是一种性能优化手段，而不是默认应该使用的模式。在以下场景中收益比较明显：

- **渲染开销大的子组件**：内部有大量 DOM 输出或复杂计算，跳过渲染的收益高于浅比较的成本。
- **列表项组件**：列表数据更新时通常只有少数几项发生变化，`memo` 可以避免整个列表重渲。
- **props 以原始值为主**：原始值（字符串、数字、布尔值）在浅比较中是值比较，不容易失效。

反之，当子组件本身渲染成本极低，或者 props 就是频繁变化的引用类型且缓存成本较高时，加 `memo` 反而可能因为额外的浅比较开销得不偿失。`memo` 应该搭配 React DevTools 的 Profiler 面板使用，先定位真正的性能瓶颈，再做针对性优化。
