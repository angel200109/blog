# TypeScript 异步编程中的类型

### 异步函数的返回值类型

在 TypeScript 中用 `async` 声明一个函数，编译器会自动将返回值包裹为 `Promise<T>`，其中 `T` 是 `return` 语句返回值的类型：

```typescript
async function fetchUserName(): Promise<string> {
  return "angel";
}
```

即使函数体写的是 `return "angel"`，调用 `fetchUserName()` 得到的是一个 `Promise<string>`，而不是 `string`。TypeScript 会在编译阶段完成这个包装，不需要手动写 `Promise.resolve("angel")`。

### await 的类型解包

`await` 会自动从 `Promise<T>` 中提取出 `T` 类型：

```typescript
async function fetchUser(): Promise<{ name: string; age: number }> {
  const response = await fetch("/api/user");
  return response.json(); // Promise<{ name: string; age: number }>
}

async function displayUser() {
  const user = await fetchUser();
  // user 的类型是 { name: string; age: number }，而不是 Promise
  console.log(user.name.toUpperCase());
}
```

`fetchUser` 的返回值是 `Promise<{ name: string; age: number }>`，但在 `displayUser` 中通过 `await` 调用后，`user` 的类型被自动解包为 `{ name: string; age: number }`。这个过程在类型层面和运行时层面同时发生——类型系统推导出解包后的类型，运行时等待 Promise 落定后拿到值。

### 错误处理的类型盲区

`async` 函数的错误处理有一个容易被忽略的类型问题：`catch` 块中的错误默认是 `unknown`（严格模式下）或 `any`：

```typescript
async function loadConfig(): Promise<Config> {
  try {
    const response = await fetch("/api/config");
    return response.json();
  } catch (error) {
    // error 的类型是 unknown（strict 模式）
    // 直接访问 error.message 会报错
    if (error instanceof Error) {
      console.error("加载配置失败:", error.message);
    }
    throw error;
  }
}
```

在 `strict: true` 下，`catch` 的参数类型是 `unknown`，需要先做类型收窄才能访问属性。这种做法比 `any` 更安全——它迫使开发者在错误分支中显式处理类型不确定性。

### Promise 链上的类型推断

当多个异步操作通过 `.then()` 串联时，TypeScript 能逐级推断类型：

```typescript
function fetchPostIds(): Promise<number[]> {
  return fetch("/api/posts")
    .then(res => res.json())
    .then((data: { ids: number[] }) => data.ids);
}
```

但如果中间某个 `.then()` 没有显式标注返回类型，类型推断可能丢失精度。建议在关键转换节点写清返回值类型，尤其是在处理后端返回的 JSON 数据时。

### Promise 组合方法的类型处理

`Promise.all` 接受一个 Promise 数组，返回一个包含所有落定值的数组，类型推断同样适用：

```typescript
async function loadDashboard() {
  const [profile, notifications, settings] = await Promise.all([
    fetchProfile(),       // Promise<UserProfile>
    fetchNotifications(), // Promise<Notification[]>
    fetchSettings(),      // Promise<UserSettings>
  ]);
  // profile: UserProfile
  // notifications: Notification[]
  // settings: UserSettings
}
```

`Promise.allSettled` 的返回值结构则不同——每个元素都是 `PromiseSettledResult<T>` 联合类型，需要通过 `.status` 字段区分：

```typescript
const results = await Promise.allSettled([
  fetchProfile(),
  fetchNotifications(),
]);

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(result.value); // 类型已收窄
  } else {
    console.error(result.reason); // 类型已收窄
  }
}
```

TypeScript 的联合类型和字面量类型在这里发挥作用：检查 `result.status === "fulfilled"` 后，该分支中的 `result` 被自动收窄为 `PromiseFulfilledResult<T>`，可以直接访问 `value` 而不需要类型断言。
