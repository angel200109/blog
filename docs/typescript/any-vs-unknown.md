# any 和 unknown 的区别

## 简介

`any` 和 `unknown` 都是 TS 的"万能类型"，但它俩的设计哲学完全相反。`any` 是关掉类型检查，`unknown` 是暂时不知道类型但要你验证了再用。

## 核心概念

### any：完全放弃检查

`any` 允许你做任何操作，不报错、不提示、不检查。相当于告诉编译器"别管我，我知道自己在干什么"：

```ts
let value: any = { name: 'Tom' }

value.name          // ✅ 随便访问
value.age           // ✅ 不存在的属性也不报错
value.getName()     // ✅ 编译器完全不管
value = 42          // ✅ 随意赋值
```

好处是灵活，坏处是失去了 TS 带来的所有保护。一个 `any` 没控制好，可能会污染整个类型推导链。

### unknown：必须验证才能用

`unknown` 也能接受任何类型的值，但你对它做任何操作之前，必须先缩窄类型：

```ts
let value: unknown = { name: 'Tom' }

value.name          // ❌ 不能直接访问 unknown 类型的属性
value.toString()    // ❌ 也不行

// 必须先验证类型
if (typeof value === 'object' && value !== null) {
  if ('name' in value) {
    console.log(value.name)  // ✅ 缩窄后安全访问
  }
}
```

### 一张表看清区别

| | `any` | `unknown` |
|---|---|---|
| 赋值给其他类型 | ✅ 可以赋给任何类型 | ❌ 只能赋给 `any` 或 `unknown` |
| 访问属性 | ✅ 不检查 | ❌ 必须先验证 |
| 调用方法 | ✅ 不检查 | ❌ 必须先验证 |
| 类型安全 | 无 | 高 |
| 适用场景 | 快速原型、临时绕过 | 接收外部不可信数据 |

```ts
let a: any = 'hello'
let b: unknown = 'hello'

let s1: string = a  // ✅ any 可以赋值给 string（危险）
let s2: string = b  // ❌ unknown 不能直接赋值给 string

// 正确做法
let s3: string = b as string  // 断言
// 或
if (typeof b === 'string') {
  let s3: string = b  // 类型缩窄
}
```

## 实战场景

从后端拿数据是 `unknown` 的典型使用场景：

```ts
const data: unknown = await response.json()
// 此时 data 类型未知，不能随便用

// 要么定义类型并验证
interface User { id: number; name: string }
const user = data as User  // 如果你确定格式

// 要么运行时校验
if (typeof data === 'object' && data !== null) {
  // 安全处理
}
```

有人觉得写 `unknown` 麻烦，直接用 `any` 省事。但省下来的时间，通常会在未来的某个 bug 上加倍还回来。

## 总结

**外部输入用 `unknown`，内部临时代码才考虑 `any`。** `any` 是逃避类型检查，`unknown` 是推迟类型判断。能不用 `any` 就不用。
