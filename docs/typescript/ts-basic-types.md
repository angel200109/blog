# TypeScript 的基础数据类型

## 简介

TS 的类型系统建立在 JS 的 7 种基础类型之上，又加了几种自己独有的类型。理清这些是最基本的功夫。

## JS 原有的基础类型

| 类型 | 示例 |
|------|------|
| `string` | `'hello'` |
| `number` | `42`, `3.14`, `NaN`, `Infinity` |
| `boolean` | `true`, `false` |
| `null` | `null` |
| `undefined` | `undefined` |
| `symbol` | `Symbol('key')` |
| `bigint` | `123n` |

声明方式很简单：

```ts
const name: string = 'tom'
const age: number = 25
const isDone: boolean = false
```

如果初始化和类型标注一致，大部分情况可以省略类型，TS 能自己推断出来：

```ts
const name = 'tom'       // 推断为 string
const scores = [90, 80]  // 推断为 number[]
```

## TS 特有的类型

### any

跳过一切类型检查，回到 JS 状态。能用，但尽量少用。引入了 TS 又写 `any`，等于白折腾：

```ts
let value: any = 1
value = 'hello'   // 不报错
value.foo.bar()   // 也不报错，但运行时会崩
```

### unknown

安全版的 `any`。可以接收任意类型的值，但操作之前必须先缩窄类型：

```ts
let data: unknown = await fetch('/api').then(r => r.json())

// data.name  ❌ 不能直接访问

if (typeof data === 'object' && data !== null && 'name' in data) {
  console.log(data.name)  // ✅ 类型缩窄后可以了
}
```

### void

表示函数没有返回值（或返回 `undefined`）：

```ts
function log(msg: string): void {
  console.log(msg)
}
```

### never

表示永远不会到达终点——比如抛异常、死循环：

```ts
function throwError(msg: string): never {
  throw new Error(msg)
}

function infiniteLoop(): never {
  while (true) {}
}
```

## 实战场景

日常用得最多的是 `string`、`number`、`boolean`，其次是 `void` 标注函数返回值。`unknown` 适合用来接收不可信的外部数据，比如 API 响应、用户输入。`never` 比较少见，但在写穷举检查的 switch 语句时很有用：

```ts
type Shape = 'circle' | 'square'

function area(shape: Shape) {
  switch (shape) {
    case 'circle': return Math.PI
    case 'square': return 1
    default:
      const _exhaustive: never = shape  // 如果新增了 Shape 成员，这里会报错
  }
}
```

## 总结

JS 7 种 + TS 4 种（any、unknown、void、never），记住 `any` vs `unknown` 和 `void` vs `never` 这两对就够了，它们是日常开发里最容易搞混的。
