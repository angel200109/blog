# interface 和 type 的区别


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

