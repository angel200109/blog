# useReducer：集中管理复杂状态逻辑

### 分散的状态操作带来的问题

当一个状态存在多种变更方式时，直接用 `useState` 会让操作逻辑散落在各个事件处理函数中：

```jsx
function App() {
  const [count, setCount] = useState(100);
  return (
    <div>
      <h1>数量: {count}</h1>
      <button onClick={() => setCount(count + 1)}>加 1</button>
      <button onClick={() => setCount(count - 1)}>减 1</button>
      <button onClick={() => setCount(count + 2)}>加 2</button>
      <button onClick={() => setCount(count - 2)}>减 2</button>
    </div>
  );
}
```

目前只有四个按钮，每个按钮各自调用 `setCount` 并计算新值。当操作种类增多（如重置、批量加减、条件增减），这些散落的逻辑难以追踪，也容易因遗漏边界条件而出错。

`useReducer` 提供了一种集中化管理方式：将状态变更逻辑收敛到一个 `reducer` 函数中，组件只需通过 `dispatch` 发出"要做什么"，而不需要知道"怎么做"。

### reducer 函数与 dispatch

```jsx
import { useReducer } from "react";

// reducer: 接收当前状态和 action，返回新状态
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + action.payload;
    case "decrement":
      return state - action.payload;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function App() {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <h1>数量: {count}</h1>
      <button onClick={() => dispatch({ type: "increment", payload: 1 })}>
        加 1
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: 1 })}>
        减 1
      </button>
      <button onClick={() => dispatch({ type: "increment", payload: 2 })}>
        加 2
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: 2 })}>
        减 2
      </button>
    </div>
  );
}
```

`useReducer` 接收两个参数：`reducer` 函数和初始状态值。返回一个数组，第一项是当前状态，第二项是 `dispatch` 触发器。

`action` 对象通常遵循 `{ type, payload }` 约定：`type` 描述操作类型，`payload` 携带操作所需的数据。`reducer` 函数根据 `action.type` 决定如何从旧状态计算出新状态，本质上是一个 `(state, action) => newState` 的纯函数。

对比 `useState` 版本，所有状态变更逻辑集中到了 `reducer` 中，新增一种操作只需在 `switch` 中加一个 `case`，事件处理函数只负责声明意图。

### 对象状态的更新

当状态是对象而非原始值时，`reducer` 需要返回新对象，保留未修改的字段：

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + action.payload };
    case "decrement":
      return { ...state, count: state.count - action.payload };
    case "rename":
      return { ...state, name: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function App() {
  const [fruit, dispatch] = useReducer(reducer, { name: "苹果", count: 10 });

  return (
    <div>
      <h1>{fruit.name}的数量是: {fruit.count}</h1>
      <button onClick={() => dispatch({ type: "increment", payload: 1 })}>
        加 1
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: 1 })}>
        减 1
      </button>
      <button onClick={() => dispatch({ type: "increment", payload: 2 })}>
        加 2
      </button>
      <button onClick={() => dispatch({ type: "decrement", payload: 2 })}>
        减 2
      </button>
      <button onClick={() => dispatch({ type: "rename", payload: "香蕉" })}>
        改名字
      </button>
    </div>
  );
}
```

与 `useState` 中调用 `setState({ ...prev, field: newValue })` 的模式一致——React 通过引用比较判断状态是否变化，必须创建新对象而非直接修改旧对象。

### 封装成自定义 Hook

当 `useReducer` 的逻辑需要复用时，可以封装为自定义 Hook：

```jsx
function useCount() {
  function reducer(state, action) {
    switch (action.type) {
      case "increment":
        return { ...state, count: state.count + action.payload };
      case "decrement":
        return { ...state, count: state.count - action.payload };
      case "rename":
        return { ...state, name: action.payload };
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }
  return useReducer(reducer, { name: "苹果", count: 10 });
}

function App() {
  const [fruit, dispatch] = useCount();
  // 组件逻辑保持不变
}
```

自定义 Hook 将 `reducer` 和初始状态封装在一起，调用方只需获取 `[state, dispatch]` 并使用。这种模式在表单状态管理、多步骤向导等场景中很实用。

### useReducer 与 useState 的决策边界

| 维度 | useState | useReducer |
|------|----------|------------|
| 状态结构 | 简单值（原始类型或扁平对象） | 复杂嵌套对象，多字段联动 |
| 更新逻辑 | 直接覆盖或简单计算 | 多种操作类型，每种有独立规则 |
| 下一个状态依赖前一个状态 | 用函数式更新 `setState(prev => ...)` | reducer 天然接收 `(state, action)` |
| 逻辑位置 | 组件体内散落 | 集中在 reducer 中，与组件解耦 |
| 可测试性 | 需要挂载组件 | reducer 是纯函数，可直接单测 |

一条简单的判断准则：当多个 `useState` 的更新之间存在依赖关系，或者同一个状态有超过三种不同的操作类型时，`useReducer` 的结构化优势就会体现出来。

### reducer 必须是纯函数

`reducer` 函数必须满足纯函数的两条约束：

1. **相同的输入产生相同的输出**——不能在 reducer 中调用 `Math.random()`、`Date.now()` 等非确定性操作，也不能发起网络请求。
2. **不产生副作用**——不能直接修改传入的 `state` 参数，也不能操作 DOM、修改外部变量。

违反这两条会导致状态不可预测：React 在 Strict Mode 下会双重调用 reducer 来检测纯函数违规，如果 reducer 不纯，可能出现状态错乱或重复副作用。
