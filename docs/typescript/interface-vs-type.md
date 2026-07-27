# interface 和 type 的区别

## 简介

`interface` 和 `type` 都能用来描述对象结构，这也是新手最容易困惑的"选择题"。大部分场景下两者可以互换，但有关键差异。

## 核心概念

### 扩展方式不同

`interface` 用 `extends`，`type` 用 `&`（交叉类型）：

```ts
// interface 扩展
interface Animal { name: string }
interface Dog extends Animal { bark(): void }

// type 扩展
type Animal = { name: string }
type Dog = Animal & { bark(): void }
```

### 声明合并

这是 `interface` 独有的特性。同名 `interface` 会自动合并：

```ts
interface User {
  name: string
}

interface User {
  age: number
}

// 最终 User 等价于 { name: string; age: number }
const user: User = { name: 'tom', age: 25 }  // ✅
```

`type` 做不到这一点——重复声明会报错：

```ts
type User = { name: string }
type User = { age: number }  // ❌ 错误：标识符重复
```

这个特性是把双刃剑。库作者用它做声明扩展很方便（比如给 `Window` 加属性），但自己项目里用不好会导致类型意外污染。

### type 能做的事更多

`type` 可以定义联合类型、交叉类型、元组，`interface` 不行：

```ts
// 联合类型——type 可以，interface 不行
type Status = 'pending' | 'success' | 'error'

// 元组
type Point = [number, number]

// 函数签名（type 更简洁）
type Callback = (data: string) => void

// interface 也能定义函数，但语法比较奇怪
interface Callback {
  (data: string): void
}
```

### 对比总结

| | `interface` | `type` |
|---|---|---|
| 描述对象结构 | ✅ | ✅ |
| 扩展 | `extends` | `&`（交叉类型） |
| 声明合并 | ✅ | ❌ |
| 联合类型 | ❌ | ✅ |
| 元组 | ❌ | ✅ |
| 函数类型 | ✅（不自然） | ✅（自然） |
| 原始类型别名 | ❌ | ✅ |

## 实战场景

**用 `interface` 的场景**：描述明确的、可扩展的对象结构——组件 props、API 响应、数据模型。

```ts
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}
```

**用 `type` 的场景**：联合类型、元组、函数签名、简单的类型别名。

```ts
type Size = 'sm' | 'md' | 'lg'
type Point = [number, number]
type AsyncData<T> = { loading: boolean; data: T | null; error: Error | null }
```

团队里最实用的做法是定个规范：**描述对象用 `interface`，其他用 `type`**。不用每次纠结。

## 总结

大部分场景两者都行。关键差异：`interface` 能声明合并，`type` 能定义联合类型。日常开发可以默认为 `interface` 描述对象、`type` 处理联合/元组/别名。
