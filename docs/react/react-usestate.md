# useState 状态管理

### 为什么需要 useState

React 函数组件在每次渲染时都会重新执行，普通变量在重新执行时会被重置为初始值，无法在多次渲染之间保持状态：

```jsx
function Counter() {
  let count = 0
  function handleAdd() {
    count++
    console.log(count) // 控制台输出正确，但页面不变
  }
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleAdd}>+1</button>
    </div>
  )
}
```

`count` 在每次点击后确实增加了，但 React 不会因为普通变量的变化而触发重新渲染。`useState` 通过声明状态变量和一个用于更新它的函数，让 React 在状态变化时重新渲染组件。

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  function handleAdd() {
    setCount(count + 1)
  }
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleAdd}>+1</button>
    </div>
  )
}
```

### 更新对象和数组

React 使用 `Object.is` 比较新旧状态来决定是否重新渲染。直接修改对象或数组的某个属性不会触发更新——必须传入一个全新的引用：

```jsx
// 错误：直接修改
data.title = 'New Title'
setData(data) // React 认为 data 引用未变，跳过渲染

// 正确：创建新对象
setData({
  ...data,
  title: 'New Title',
})
```

```jsx
// 数组新增：展开旧数组并追加新元素
setTaskList([...taskList, { id: 4, name: 'Review' }])

// 数组删除：使用 filter 返回新数组
setTaskList(taskList.filter(task => task.id !== targetId))
```

### setState 的异步性与批量更新

`setState` 是异步执行的。调用后立即读取状态值，拿到的仍然是旧值：

```jsx
function handleClick() {
  setCount(count + 1)
  console.log(count) // 旧值，因为状态还未更新
}
```

在同一个事件处理函数中多次调用 `setState`，React 会在内部将其批量合并，组件只会重新渲染一次：

```jsx
function handleClick() {
  setCount(count + 1)
  setCount(count + 1) // 这两次 setCount 都基于同一个 count，结果只加了 1
}
```

如果需要基于前一个状态值进行计算，使用函数式更新：

```jsx
setCount(prev => prev + 1)
setCount(prev => prev + 1) // 基于上一次更新的结果，最终加 2
```

### state 的缓存特性

`useState` 在组件重新渲染时会保留上一次的值，而不是重新初始化为 `useState(initialValue)` 中的初始值。`initialValue` 只在组件首次挂载时使用。

对比普通变量和 state 的行为：

```jsx
function App() {
  const [count, setCount] = useState(0)
  let x = 100

  function handleClick() {
    setCount(prev => {
      x += 1 // 每次组件重新渲染，x 都会重置为 100
      console.log(`count: ${count}, x: ${x}`)
      return prev + 1
    })
  }
  // ... 
}
```

`count` 在多次渲染间保持递增，而 `x` 每次渲染都重置为 100。

### 使用注意事项

**避免在组件顶层直接调用 setState（会导致无限循环）**：

```jsx
function App() {
  const [count, setCount] = useState(0)
  setCount(count + 1) // 组件渲染 → setState → 触发渲染 → 无限循环
  
  return <div>{count}</div>
}
```

**避免在定时器或副作用中无条件调用 setState**：

```jsx
function App() {
  const [count, setCount] = useState(0)
  
  setTimeout(() => {
    setCount(count + 1) // 同样会导致无限循环
  }, 1000)
  
  return <div>{count}</div>
}
```

如果需要初始化后异步获取数据，应当使用 `useEffect` 并传入空依赖数组，确保只在挂载阶段执行一次。

**setState 必须在函数组件或自定义 Hook 的顶层调用**，不能放在条件语句、循环或嵌套函数中——这与 Hooks 的调用顺序规则相关。
