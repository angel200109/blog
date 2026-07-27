# TypeScript 泛型

## 简介

泛型是 TS 里最核心的高级特性。简单讲就是把"具体类型"变成"变量"，让你写一次就能适配多种类型。

## 核心概念

### 为什么需要泛型

没泛型时，想写一个通用的工具函数只能上 `any`：

```ts
// ❌ 用 any 丢失了类型信息
function first(arr: any): any {
  return arr[0]
}

const result = first([1, 2, 3])  // result 是 any，不是 number
```

有了泛型：

```ts
function first<T>(arr: T[]): T {
  return arr[0]
}

const result = first([1, 2, 3])  // result 推断为 number ✅
```

泛型会**记住**调用时的具体类型，并把它带进返回值。类型信息流向了调用方。

### 泛型的多种形态

**泛型函数：**

```ts
function identity<T>(value: T): T {
  return value
}

identity<string>('hello')  // 显式指定 T = string
identity('hello')          // 自动推断 T = string
```

**泛型接口：**

```ts
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

type UserResponse = ApiResponse<User>
type ListResponse = ApiResponse<User[]>
```

**泛型类：**

```ts
class Stack<T> {
  private items: T[] = []

  push(item: T) { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
}

const numStack = new Stack<number>()
numStack.push(1)
numStack.push('hello')  // ❌ 不是 number
```

### 约束泛型：extends

不希望 T 可以是任意类型时，用 `extends` 加个限制：

```ts
// 约束 T 必须能有 length 属性
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

getLength('hello')       // ✅ string 有 length
getLength([1, 2, 3])     // ✅ 数组有 length
getLength(42)            // ❌ number 没有 length
```

多类型约束也常见：

```ts
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}
```

### keyof + 泛型：精确到属性名

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'tom', age: 25 }
getProperty(user, 'name')  // ✅ 返回 string
getProperty(user, 'email') // ❌ 'email' 不是 user 的 key
```

## 实战场景

**React 里最常见：**

```ts
import { useRef, useState } from 'react'

const inputRef = useRef<HTMLInputElement>(null)  // 指定 ref 类型
const [user, setUser] = useState<User | null>(null)  // 指定 state 类型
```

**封装通用组件：**

```ts
interface SelectProps<T> {
  options: T[]
  value: T
  onChange: (value: T) => void
  renderOption: (option: T) => string
}
```

## 总结

泛型 = 类型的参数化。`T` 不是魔法，就是"占位——调用时才填入具体类型"。`extends` 用来约束这个占位符的范围，`keyof` 把占位符精确到对象的属性名。从函数到接口到类到 React 组件，泛型无处不在。
