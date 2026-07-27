# void 和 never 的区别

## 简介

`void` 和 `never` 都不产生有用的返回值，新手容易搞混。一句话区别：**函数正常结束但没有返回值 → void；函数根本不会正常结束 → never。**

## 核心概念

### void：执行完了，没返回东西

```ts
function log(msg: string): void {
  console.log(msg)
  // 没有 return 语句，或者 return; return undefined;
}
```

`void` 表示这个函数会正常执行完毕，只是没有返回有意义的值。调用方可以继续执行后面的代码。

### never：永远到不了终点

```ts
function throwError(msg: string): never {
  throw new Error(msg)
  // 这行之后的代码永远不会执行
}

function infiniteLoop(): never {
  while (true) {
    // 永远不会 return
  }
}
```

`never` 表示函数不会正常结束——要么抛异常，要么死循环。调用 `never` 函数之后，后面的代码在类型层面上就被认为是"不可达"的：

```ts
function handleError(): never {
  throw new Error('出错了')
}

function process() {
  handleError()
  console.log('这行永远不会执行')  // TS 不会有任何提示，但在逻辑上是不可达的
}
```

### void vs never 对比

| | `void` | `never` |
|---|---|---|
| 函数是否有 return | 有（或隐式 return undefined） | 没有，永远不会返回 |
| 调用后代码是否可达 | 可达 | 不可达 |
| 变量是否能持有 | `let x: void = undefined` | `never` 不能赋值给任何类型（除了 `never` 自己） |
| 典型场景 | 副作用函数（log、setState） | 抛异常、死循环、穷举检查 |

### never 的妙用：穷举检查

```ts
type Action = 'create' | 'update' | 'delete'

function handleAction(action: Action) {
  switch (action) {
    case 'create': return '创建'
    case 'update': return '更新'
    case 'delete': return '删除'
    default:
      // 如果将来 Action 新增了 'query'，这里就会报编译错误
      const _exhaustive: never = action
      return _exhaustive
  }
}
```

当你新增了 `Action` 的成员但忘了在 switch 里加 case，`never` 会帮你发现这个遗漏。

## 实战场景

日常开发中 `void` 用得更多——几乎所有不关心返回值的函数都用它。`never` 出现频率低，但在写工具函数（错误处理、类型体操）和穷举检查时很有价值。

```ts
// 典型的 void 使用
useEffect(() => {
  fetchData()
}, [])

// 典型的 never 使用
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
```

## 总结

`void`：函数能跑完，没返回值。`never`：函数跑不完，永远没有返回值。判断标准很简单——函数执行完后控制权能不能回到调用方，能就是 `void`，不能就是 `never`。
