# JSX 基础与插值渲染

### JSX 是什么

JSX 是 JavaScript 的语法扩展，允许在 JS 代码中直接编写类似 HTML 的标记结构。它不是模板语言，而是 `React.createElement()` 的语法糖——JSX 代码在构建阶段被 Babel 或 TypeScript 编译器转换为纯 JavaScript 函数调用。

```jsx
// JSX 写法
const element = <h1 className="title">Hello World</h1>

// 编译后的等价代码
const element = React.createElement('h1', { className: 'title' }, 'Hello World')
```

JSX 遵循 XML 规范，有几个与 HTML 不同的命名约定：
- `class` → `className`
- `for` → `htmlFor`
- 事件属性使用驼峰命名：`onclick` → `onClick`，`onchange` → `onChange`

JSX 表达式必须返回单个根元素。如果需要返回多个同级元素，使用 Fragment（`<>...</>`）包裹。

### 花括号插值

JSX 中使用 `{ }` 嵌入 JavaScript 表达式。不同类型的值在插值时有不同的渲染行为：

```jsx
// 字符串、数字：直接渲染
<p>{100}</p>           // 页面显示 100
<p>{'Hello World'}</p> // 页面显示 Hello World

// 函数调用：执行函数并渲染返回值
function getGreeting(name) {
  return `Hello, ${name}`
}
<p>{getGreeting('John')}</p> // 页面显示 Hello, John

// 注意：直接放置函数引用不会渲染任何内容
<p>{getGreeting}</p>

// 事件处理器中直接传递函数引用
<button onClick={handleClick}>Click</button>

// 数组：依次渲染数组中的每一项
<p>{[1, 2, 3]}</p>   // 页面显示 123

// 列表渲染
<ul>
  {taskList.map(task => <li key={task.id}>{task.name}</li>)}
</ul>

// 布尔值、null、undefined：不渲染任何内容
<p>{true}</p>      // 无渲染
<p>{false}</p>     // 无渲染
<p>{null}</p>      // 无渲染
<p>{undefined}</p> // 无渲染
```

布尔值不渲染的特性常用于条件渲染：

```jsx
<div>
  {isLoggedIn && <UserDashboard />}
</div>
```

### 属性绑定

JSX 中属性值可以使用花括号动态绑定：

```jsx
function App() {
  const avatarUrl = '/images/avatar.png'
  const description = 'User avatar'

  return (
    <img src={avatarUrl} alt={description} className="avatar" />
  )
}
```

`style` 属性接收一个 JavaScript 对象，属性名使用驼峰命名：

```jsx
const cardStyle = {
  width: 300,
  height: 'auto',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
}

<div style={cardStyle}>Content</div>
```

当需要传递大量属性时，使用展开运算符简化：

```jsx
const buttonProps = {
  className: 'btn-primary',
  disabled: isLoading,
  onClick: handleSubmit,
}

<button {...buttonProps}>Submit</button>
```

### 条件渲染

JSX 本身不支持 `if` / `else` 语句，但可以通过 JavaScript 表达式实现：

```jsx
// 三元表达式
<div>{isEditing ? <Editor /> : <Preview />}</div>

// 提前赋值
let content
if (status === 'loading') {
  content = <Spinner />
} else if (status === 'error') {
  content = <ErrorBanner message={errorMsg} />
} else {
  content = <DataView data={result} />
}

return <div>{content}</div>
```
