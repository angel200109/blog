# 类型断言 as


### 两种写法

```ts
let value: any = 'hello world'

// 写法一：as（推荐，React 里只能用这个）
const len1 = (value as string).length

// 写法二：尖括号（不推荐，在 JSX 里会跟标签搞混）
const len2 = (<string>value).length
```

React 项目里统一用 `as`，尖括号语法跟 JSX 冲突。

### 使用场景

**1. DOM 操作——最常见**

```ts
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')  // ✅ 不需要再判空

// 更安全的方式
const el = document.getElementById('myCanvas')
if (el instanceof HTMLCanvasElement) {
  const ctx = el.getContext('2d')  // ✅ 运行时验证 + 类型缩窄
}
```

**2. API 响应数据**

```ts
interface User { id: number; name: string }

const res = await fetch('/api/user/1')
const user = (await res.json()) as User
```

TS 不知道后端返回什么数据，用 `as` 断言是最简单的方式。但注意这不是运行时校验——如果后端返回的格式不对，只有跑到使用 `user.xxx` 的时候才会炸。

**3. 缩小类型范围**

```ts
type Event = MouseEvent | KeyboardEvent

function handler(event: Event) {
  (event as MouseEvent).clientX  // 断言为具体类型
}
```

### 断言的限制

`as` 不会做类型转换——它只改变 TS 看到的类型，不改变运行时的实际值。而且不是你随便断什么都能通过：

```ts
let x = 'hello' as number  // ❌ string 和 number 没有重叠，直接报错

// 想绕过可以分两步
let x = ('hello' as unknown) as number  // ⚠️ 能编译，但运行时当然还是 'hello'
```

双重断言（先 `as unknown` 再 `as 目标类型`）会跳过关卡，但这是危险的信号——通常意味着你的类型设计有问题。

