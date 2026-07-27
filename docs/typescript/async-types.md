# 异步编程中的类型

## 简介

TS 对异步代码的类型支持很自然——`Promise<T>` 的泛型参数能让链式调用的每一步保持类型正确，`async/await` 也不例外。

## 核心概念

### Promise 的泛型 `Promise<T>`

`Promise<T>` 中的 `T` 描述的是 resolve 后拿到的值的类型：

```ts
// 返回 Promise<string>，TS 知道 resolve 的值是 string
async function fetchData(): Promise<string> {
  return 'Data loaded'
}

// 调用方使用
async function handle() {
  const data = await fetchData()  // data: string ✅
  console.log(data.toUpperCase())
}
```

如果不标注 `Promise<T>`，TS 会从 return 语句推断，但标注了能提前在函数内部发现错误：

```ts
async function getCount(): Promise<number> {
  return '42'  // ❌ 类型 'string' 不能赋值给 'Promise<number>'
}
```

### 错误处理也要管类型

`catch` 收到的 error 类型默认是 `unknown`（TS 4.0+）：

```ts
try {
  await fetchData()
} catch (error) {
  // error 是 unknown，不能直接访问 .message
  if (error instanceof Error) {
    console.log(error.message)  // ✅ 类型守卫后安全
  }
}
```

如果确定只会抛出 `Error`，可以用 `as` 断言，但类型守卫更安全。

### 泛型 Promise 链

```ts
function getUser(id: number): Promise<User> {
  return fetch(`/api/user/${id}`).then(r => r.json())
}

function getUserName(id: number): Promise<string> {
  return getUser(id).then(user => user.name)  // TS 知道 user 是 User
}
```

每一步的类型都跟着泛型参数自动推导。

### 并发 Promise 的类型

```ts
const [user, posts] = await Promise.all([
  getUser(1),
  getPosts(1),
])
// TS 推断：user: User, posts: Post[]
```

`Promise.all` 的参数是元组时，返回值的类型也是对应的元组。

## 实战场景

封装 API 层最常用：

```ts
interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

async function request<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url)
  return res.json()
}

// 使用
const res = await request<User>('/api/user/1')
// res.data: User ✅
```

注意 `fetch` 返回的 `response.json()` 返回类型是 `Promise<any>`——这就是为什么建议在外层封装时用泛型明确类型，而不是在每一处调用时 `as User`。

## 总结

`Promise<T>` 的泛型是 TS 异步类型的基石。`async` 函数的返回值自动包一层 `Promise`，`await` 解包返回 `T`。错误处理记得 `error` 是 `unknown`，用 `instanceof` 缩窄。
