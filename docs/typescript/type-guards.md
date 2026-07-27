# 类型守卫

## 简介

类型守卫让你在运行时缩小变量的类型范围。TS 会根据你的检查逻辑自动推断出更精确的类型，后续代码就能安全访问专属属性。

## 核心概念

### typeof：基本类型守卫

```ts
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // value 缩窄为 string
  }
  return value.toFixed(2)      // value 缩窄为 number
}
```

`typeof` 能判断的类型：`string`、`number`、`boolean`、`symbol`、`undefined`、`object`、`function`。注意 `typeof null === 'object'`，这是个历史坑。

### instanceof：类/构造函数守卫

```ts
class ApiError extends Error {
  constructor(public code: number) { super() }
}

function handleError(err: Error) {
  if (err instanceof ApiError) {
    console.log(err.code)  // err 缩窄为 ApiError
  }
}
```

### in：属性存在守卫

```ts
interface Circle { radius: number }
interface Square { sideLength: number }

function area(shape: Circle | Square) {
  if ('radius' in shape) {
    return Math.PI * shape.radius ** 2  // shape 缩窄为 Circle
  }
  return shape.sideLength ** 2          // shape 缩窄为 Square
}
```

### 自定义类型守卫：is

前面几种只能判断基本类型和属性存在。复杂场景下，你需要自己写守卫函数：

```ts
interface User { id: number; name: string }

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as User).id === 'number'
  )
}

const data: unknown = await fetch('/api/user').then(r => r.json())

if (isUser(data)) {
  console.log(data.name)  // ✅ data 缩窄为 User
}
```

`obj is User` 是自定义守卫的返回值语法。如果函数返回 `true`，TS 就知道 `obj` 是 `User` 类型。

### 可辨识联合（Discriminated Union）

用共同的 `kind`/`type` 字段区分不同成员，是设计模式，不是语法特性，但配合 switch 使用效果很好：

```ts
interface Success { status: 'success'; data: string[] }
interface Error { status: 'error'; message: string }

type Result = Success | Error

function handle(result: Result) {
  switch (result.status) {
    case 'success': return result.data.length
    case 'error': return result.message
  }
}
```

## 实战场景

从 API 拿数据是自定义守卫最典型的场景——你不知道返回的到底是不是你期望的类型：

```ts
async function fetchUsers() {
  const res = await fetch('/api/users')
  const data: unknown = await res.json()

  if (Array.isArray(data) && data.every(isUser)) {
    // data: User[] ✅
    return data
  }
  throw new Error('Invalid response format')
}
```

## 总结

`typeof` 判基本类型，`instanceof` 判断类实例，`in` 判属性存在，自定义 `is` 处理复杂逻辑。类型守卫让 `unknown` 和联合类型变得可用，是写安全 TS 代码的基础技能。
