# 交叉类型和联合类型

## 简介

交叉类型（`&`）和联合类型（`|`）是 TS 类型系统里最容易混淆的一对。它们的作用完全相反：一个是"全都要"，一个是"任选其一"。

## 核心概念

### 联合类型：就是其中之一

变量可以是你列出的多个类型中的任意一个：

```ts
let value: string | number

value = 'hello'   // ✅
value = 42        // ✅
value = true      // ❌ boolean 不在联合中
```

使用联合类型的变量时，只能访问**所有成员共有的属性**：

```ts
function format(value: string | number) {
  value.toString()  // ✅ string 和 number 都有 toString
  value.length      // ❌ number 没有 length
  value.toFixed()   // ❌ string 没有 toFixed
}

// 必须缩窄类型后才能访问独有的属性
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // ✅ 这里确定是 string
  }
  return value.toFixed(2)       // ✅ 这里确定是 number
}
```

### 交叉类型：同时具备所有

`&` 把多个类型"合"在一起，结果必须同时满足所有条件：

```ts
type Nameable = { name: string }
type Ageable = { age: number }

type Person = Nameable & Ageable

const person: Person = {
  name: 'tom',   // ✅ 必须有
  age: 25,       // ✅ 必须有
}
// 缺任何一个都会报错
```

### 类型缩窄

联合类型 + 类型缩窄是 TS 最常用的组合：

```ts
type Shape = Circle | Square

interface Circle { kind: 'circle'; radius: number }
interface Square { kind: 'square'; sideLength: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2  // shape 缩窄为 Circle
    case 'square':
      return shape.sideLength ** 2        // shape 缩窄为 Square
  }
}
```

## 实战场景

联合类型最常见的场景是枚举值、API 响应状态、函数重载参数：

```ts
// 字面量联合：限定可选值
type Status = 'idle' | 'loading' | 'success' | 'error'

// 可辨识联合（discriminated union）
interface IdleState { status: 'idle' }
interface LoadingState { status: 'loading'; progress: number }
interface SuccessState { status: 'success'; data: string[] }
interface ErrorState { status: 'error'; message: string }

type AsyncState = IdleState | LoadingState | SuccessState | ErrorState

function render(state: AsyncState) {
  switch (state.status) {
    case 'idle': return '等待中'
    case 'loading': return `加载中 ${state.progress}%`  // progress 可用
    case 'success': return state.data.join(',')          // data 可用
    case 'error': return `出错了：${state.message}`      // message 可用
  }
}
```

交叉类型则常用于组合多个 interface 或给已有类型加料：

```ts
type Employee = Person & { employeeId: number }

// 或者用 interface extends
interface Employee extends Person {
  employeeId: number
}
```

## 总结

联合是"或"（满足其一），交叉是"且"（全部满足）。判断可以用这个帮助：**联合访问共有、交叉拥有全部**。日常开发里联合用得更多，交叉更多出现在类型组合和泛型约束中。
