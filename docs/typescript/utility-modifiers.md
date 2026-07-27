# 非空断言、可选属性与只读

## 简介

`!`、`?`、`readonly` 是 TS 里三个频率极高的辅助符号。它们单独都不复杂，但凑在一起时新手容易搞不清楚该用哪个。

## 核心概念

### 可选属性 `?`

标记属性为可选的——这个属性可以不存在：

```ts
interface User {
  name: string
  age?: number  // 可选，可以不给
}

const u1: User = { name: 'tom' }            // ✅ 没有 age
const u2: User = { name: 'tom', age: 25 }   // ✅ 有 age
```

本质上是 `age: number | undefined`：

```ts
const user: User = { name: 'tom' }
console.log(user.age?.toFixed(2))  // 必须用 ?. 访问，否则可能报错
```

函数参数也可以用可选：

```ts
function greet(name: string, title?: string) {
  return title ? `${title} ${name}` : name
}
```

### 非空断言 `!`

告诉 TS："我知道这个值不可能是 `null` 或 `undefined`，别报错了"：

```ts
const el = document.getElementById('app')!
el.innerHTML = 'hello'  // ✅ 跳过空值检查
```

`!` 是编译时的操作，不影响运行时。如果断言错了，运行时报错还是跑不掉。

常见场景——确定值一定存在的 DOM 操作、初始化后一定有值的 ref：

```ts
const inputRef = useRef<HTMLInputElement>(null)

// 在 useEffect 中确定 ref 已挂载
useEffect(() => {
  inputRef.current!.focus()  // 非空断言
}, [])
```

### 只读 `readonly`

标记属性只能在声明时或构造函数里赋值，之后不能再改：

```ts
interface User {
  readonly id: number
  name: string
}

const user: User = { id: 1, name: 'tom' }
user.name = 'jerry'  // ✅ 可以改
user.id = 2          // ❌ 只读属性不能改
```

`readonly` 也能用在数组和元组上：

```ts
const arr: readonly number[] = [1, 2, 3]
arr.push(4)       // ❌ readonly 数组不可变
arr[0] = 100      // ❌ 也不行

const tuple: readonly [string, number] = ['hello', 42]
tuple[0] = 'bye'  // ❌
```

注意 `readonly` 是编译时约束，编译后照样能改——它不像 `Object.freeze` 那样有运行时保护。

### 三者组合

一个典型的类型定义可能同时用到它们：

```ts
interface Config {
  readonly id: number
  name: string
  timeout?: number       // 可选
  callback?: () => void  // 可选
}

function init(config: Config) {
  if (config.callback) {
    config.callback()  // ✅ 类型守卫缩窄后安全
  }
}
```

## 实战场景

**`?` 和 `!` 的边界：** 如果能用类型守卫或 `if` 判断解决空值问题，就别上 `!`。非空断言相当于跟编译器说"我比你知道得多"——但如果错了，线上报错不会提前通知你。

```ts
// ❌ 偷懒
const data: User | null = getUser()
console.log(data!.name)

// ✅ 安全
const data = getUser()
if (data) {
  console.log(data.name)
}
```

**`readonly` 的实际价值：** 与其说是安全机制，不如说是**契约声明**——告诉团队成员和其他调用者"这个属性你不应该改"。React 的 `props` 和 Redux 的 state 本质上都是 readonly 的概念。

## 总结

`?` 表示"可能没有"，`!` 表示"我知道一定有"，`readonly` 表示"创建后不能改"。`?` 和类型守卫搭配最安全，`!` 少用，`readonly` 多用在数据模型和不希望被修改的配置上。
