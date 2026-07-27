# 类型推断 vs 类型注释

## 简介

TS 不是非得每个变量都手写类型。它会自动推断，但有时候又需要你明确指定。知道什么时候该写什么时候不用写，代码会更干净。

## 核心概念

### 类型推断：让编译器帮你猜

TS 会根据初始值自动推导类型，这种情况下你不需要重复写：

```ts
let name = 'tom'           // 推断为 string
let age = 25               // 推断为 number
let scores = [90, 80]      // 推断为 number[]
let isDone = true          // 推断为 boolean

// 下面的写法很蠢——类型标注完全重复了推断结果
let name: string = 'tom'   // 多余的标注
let age: number = 25       // 多余的标注
```

初始化就能确定类型的变量，放心交给编译器推断。

### 类型注释：明确告诉编译器

下面这些场景推断不出来或者推断出来的不是你想要的：

**1. 变量初始化时类型不明确：**

```ts
let result: string | null = null
// 不标注的话推断为 null 类型，后续无法赋值为 string
```

**2. 函数参数：**

```ts
// 必须标注，因为调用时才知道值
function greet(name: string, times: number) {
  return `${name} ${'!'.repeat(times)}`
}
```

**3. 函数返回值（建议标注）：**

```ts
function getUser(): User {
  return { id: 1, name: 'tom' }
}
// 标注了返回值类型，函数内部写错时会在定义处直接报错
```

返回值的类型推断往往很准，但建议显式标注——这样在函数内部写错时，错误会定位在 return 语句而不是调用处。

**4. 对象字面量需要约束结构时：**

```ts
const config: AppConfig = {
  api: 'https://api.example.com',
  timeout: 5000
}
```

### 什么时候用哪个

| 场景 | 推荐 |
|------|------|
| 变量初始化能确定类型 | 推断 |
| 函数参数 | 注释 |
| 函数返回值 | 注释（尤其是在公共 API 中） |
| 延迟初始化的变量 | 注释 |
| 从数组推导出的类型已足够 | 推断 |
| 希望类型更窄或更宽 | 注释 |

## 实战场景

实际项目里的一个原则：**能推断的让编译器推断，需要约束的写注释。** 函数参数和返回值必写，局部简单变量不写。

```ts
// ✅ 简洁且安全
const items = [1, 2, 3]          // 推断
const doubled = items.map(n => n * 2)  // 推断

// ✅ 边界明确
function merge<T extends object>(a: T, b: Partial<T>): T {
  return { ...a, ...b }
}
```

## 总结

不要把类型注释当任务——每个变量都写一遍类型并不会让你的代码更安全，反而让编译器少了一个检查你推导链是否正确的机会。
