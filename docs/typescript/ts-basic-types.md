# TypeScript 的基础数据类型

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

