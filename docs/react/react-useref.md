# useRef：跨渲染周期保持引用不变

### useRef 与 useState 的核心区别

`useRef` 创建一个可变的引用容器，其 `.current` 属性可以在整个组件生命周期中被修改，且修改不会触发重新渲染。

| | useState | useRef |
|------|----------|--------|
| 修改值 | 触发重新渲染 | 不触发重新渲染 |
| 组件重新渲染时 | 保持上一次的值 | 保持上一次的值 |
| 值的存储位置 | React 内部状态队列 | 组件 fiber 节点的 `memoizedState` 链表 |
| 典型用法 | 驱动 UI 的数据 | 非 UI 相关的可变值 |

`useState` 和 `useRef` 都有"记忆能力"——能在多次渲染间保持同一个值。区别在于是否触发渲染：需要驱动 UI 更新的数据用 `useState`，只需要保存引用或跨渲染维持值的用 `useRef`。

### 保存跨渲染的可变值

函数组件中直接定义的变量在每次渲染时都会重新初始化，无法"记住"上一次的值：

```jsx
function Timer() {
  let timerId; // 每次渲染都是 undefined

  const handleStart = () => {
    clearInterval(timerId);
    timerId = setInterval(() => {
      console.log("定时任务运行中");
    }, 1000);
  };

  return <button onClick={handleStart}>启动定时器</button>;
}
```

当组件因其他状态变更而重渲染时，`timerId` 被重置为 `undefined`，之前启动的定时器引用丢失，无法在后续操作中清除——造成内存泄漏。

`useRef` 解决这个问题：

```jsx
function Timer() {
  const timerRef = useRef(null);

  const handleStart = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      console.log("定时任务运行中");
    }, 1000);
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <>
      <button onClick={handleStart}>启动</button>
      <button onClick={handleStop}>停止</button>
    </>
  );
}
```

`timerRef.current` 的值在多次渲染间保持不变，组件的启动和停止操作始终操作同一个引用。这种模式适用于定时器 ID、WebSocket 连接实例、音频上下文等需要在组件生命周期中持续持有的资源。

### 操作 DOM 元素

`useRef` 最直观的用法是绑定到 DOM 元素的 `ref` 属性，获取对真实 DOM 节点的引用：

```jsx
function App() {
  const headingRef = useRef(null);

  function handleClick() {
    headingRef.current.textContent = "Hello, React!";
  }

  return (
    <>
      <h1 ref={headingRef}>原始标题</h1>
      <button onClick={handleClick}>修改标题</button>
    </>
  );
}
```

组件挂载后，`headingRef.current` 指向 `<h1>` DOM 节点，可以直接调用原生 DOM API。这种直接操作 DOM 的方式适用于焦点管理、滚动定位、文本选区、第三方 DOM 库集成等场景。

### 通过 forwardRef 向父组件暴露子组件的 DOM

默认情况下，`ref` 不会通过 props 传递到子组件内部。要允许父组件获取子组件中的 DOM 节点，需要 `forwardRef` 包裹子组件：

```jsx
import { forwardRef, useRef } from "react";

const Child = forwardRef((props, ref) => {
  return <div ref={ref}>Hello, I am Angel</div>;
});

function App() {
  const childRef = useRef(null);

  function handleClick() {
    childRef.current.style.color = "red";
  }

  return (
    <>
      <button onClick={handleClick}>修改子组件颜色</button>
      <Child ref={childRef} />
    </>
  );
}
```

`forwardRef` 接收一个渲染函数，该函数额外接收父组件传入的 `ref` 作为第二个参数。子组件内部通过 `ref={ref}` 将某个 DOM 节点暴露出去。

这种做法的风险在于：父组件获得了子组件内部 DOM 的完全控制权，破坏了组件的封装性。父组件可以随意修改子组件的样式、属性、内容，子组件无法约束这种行为。

### 用 useImperativeHandle 控制暴露内容

```jsx
import { forwardRef, useRef, useImperativeHandle } from "react";

const Child = forwardRef((props, ref) => {
  const divRef = useRef(null);

  // 只暴露自定义方法，不暴露 DOM 节点
  useImperativeHandle(ref, () => ({
    highlight() {
      divRef.current.style.color = "red";
    },
    reset() {
      divRef.current.style.color = "";
    },
  }));

  return <div ref={divRef}>Hello, I am Angel</div>;
});

function App() {
  const childRef = useRef(null);

  function handleClick() {
    childRef.current.highlight();
  }

  return (
    <>
      <button onClick={handleClick}>高亮子组件</button>
      <Child ref={childRef} />
    </>
  );
}
```

`useImperativeHandle` 允许子组件定义一个自定义实例值，替代默认的 DOM 节点引用。父组件只能调用子组件显式暴露的方法（如 `highlight`、`reset`），无法直接访问内部 DOM。

这相当于为组件的 ref 定义了一个"公共 API"，在保持封装性的同时提供必要的外部控制能力。适合模态框的 `open`/`close`、表单的 `validate`/`reset`、富文本编辑器的 `getContent` 等场景。
