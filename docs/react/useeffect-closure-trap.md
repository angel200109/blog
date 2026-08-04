# React useEffect 闭包陷阱

### 一个经典的 Bug

以下代码的本意是让一个计数器每秒自增 1：

```javascript
import { useState, useEffect } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []); // 空依赖数组，仅在挂载时执行一次

  return <div>当前计数：{count}</div>;
};
```

实际表现：计数器从 0 跳到 1，之后永远停在 1，不再增长。

### 为什么会这样

问题的根源是闭包与 `useEffect` 依赖数组的交互。

`useEffect` 的依赖数组为空，意味着这个副作用只在组件首次渲染后执行一次。回调函数在首次渲染时创建，它捕获的 `count` 是那一刻的值——0。

`setInterval` 的回调是一个内层函数，它引用了外层 `useEffect` 回调中的 `count`。由于外层只执行了一次，内层函数引用的 `count` 始终是变量创建时捕获的快照——0。之后组件因为 `setCount` 重新渲染，每次渲染产生的 `count` 是新的值，但定时器持有的依旧是那个捕获了 0 的旧闭包。

因此每次执行的实际上是 `setCount(0 + 1)`，count 变为 1 后下一轮又被 `setCount(0 + 1)` 拉回 1，形成了死循环。

### 解法一：函数式更新（推荐）

不依赖闭包中的 `count`，而是使用 `setState` 的函数式更新形式：

```javascript
useEffect(() => {
  const timerId = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, []);
```

`setCount(prev => prev + 1)` 接收的是 React 内部维护的最新状态值，不受闭包快照的影响。定时器只创建一次，cleanup 函数只执行一次，简洁且高效。这是处理 `setInterval` 闭包问题的首选方案。

### 解法二：把 count 放入依赖数组

```javascript
useEffect(() => {
  const timerId = setInterval(() => {
    setCount(count + 1);
  }, 1000);

  return () => clearInterval(timerId);
}, [count]);
```

每次 `count` 变化时，React 会先执行上一次 cleanup 函数清除旧定时器，然后重新执行 `useEffect` 创建新定时器，新定时器捕获了最新的 `count`。功能正确，但代价是每秒重建和销毁定时器——对于定时器这种需要长期运行的副作用，频繁重建既多余又不够优雅。

### 解法三：useRef 保存最新值

用 `useRef` 维护一个始终指向最新 `count` 的引用，让定时器通过 ref 读取：

```javascript
import { useState, useEffect, useRef } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(countRef.current + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <div>{count}</div>;
};
```

`countRef` 是一个在组件整个生命周期中保持同一个引用的对象，修改 `current` 不会触发重渲染。定时器只创建一次，通过 `countRef.current` 每次都能拿到最新的值（因为是引用类型，读取的是对象属性而非捕获的快照）。额外需要一个 `useEffect` 来同步 ref。

### 解法四：用 setTimeout 递归替代 setInterval

```javascript
useEffect(() => {
  let timerId;

  const tick = () => {
    timerId = setTimeout(() => {
      setCount(prev => prev + 1);
      tick();
    }, 1000);
  };

  tick();

  return () => clearTimeout(timerId);
}, []);
```

用 `setTimeout` 模拟 `setInterval` 的行为。每次回调执行时重新调度下一次超时，配合函数式更新，既避免了闭包陷阱也无需重复创建定时器。这种方式的一个附带好处是：如果某次回调内部的操作耗时较长，前一次回调执行完毕后才调度下一次，避免了多个回调并发执行的问题。

### 闭包陷阱的本质

`useEffect` 的闭包陷阱不是 React 特有的 Bug，而是 JavaScript 闭包与 React 渲染模型的自然结果。React 每次渲染都产生一套全新的 props、state 和 effect 回调，它们各是当前快照的闭包。当副作用跨越多次渲染（如定时器、WebSocket 连接）而依赖数组告知 React 不需要重新创建时，旧闭包和新状态之间的时间差就产生了。

处理这个问题的两条基本思路：要么让副作用随依赖更新（解二），要么让副作用不依赖闭包中的值（解一、解三、解四）。在实际开发中，函数式更新通常是首选项，因为它在正确性和简洁性之间取得了最好的平衡。
