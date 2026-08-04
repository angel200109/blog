# TypeScript 中 void 与 never 的区别

### 表象相似，本质不同

`void` 和 `never` 都表示"没有值"，但它们描述的"没有值"是两种完全不同的含义。

`void` 表示函数正常执行完毕，但返回的值没有业务意义。最常见的就是那些只产生副作用（打印日志、修改 DOM、发送请求）但不返回数据的函数。

`never` 表示一个值永远不可能出现。最常见的来源是永远不会正常返回的函数——要么抛出异常，要么陷入无限循环。

### void：能执行完，但没有有效返回值

```typescript
function logMessage(message: string): void {
  console.log(message);
  // 函数正常结束，return 语句省略，隐式返回 undefined
}

function handleClick(): void {
  updateDOM();
  trackEvent();
  // 执行完毕，没有返回任何有意义的值
}
```

TypeScript 中，`void` 类型的变量只能赋值为 `undefined` 或 `null`（非严格模式下）。在严格模式中，`void` 约等于 `undefined`。

需要注意的是，`void` 并不阻止函数体中出现 `return` 语句——它只是表示返回值不应被使用：

```typescript
function earlyReturn(flag: boolean): void {
  if (!flag) return; // 合法，提前退出但不返回有效值
  doSomething();
}
```

### never：执行不完，或者根本不应该发生

```typescript
function throwError(message: string): never {
  throw new Error(message);
  // 函数永远不会执行到结束，因此没有返回值
}

function infiniteLoop(): never {
  while (true) {
    // 永远不会退出
  }
}
```

`throwError` 执行到 `throw` 就终止了，`infiniteLoop` 永远转不出循环。这两种情况下，调用点之后的代码不会被执行，TypeScript 可以利用这个特性做"穷尽性检查"：

```typescript
type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 5 * 5;
    case 'square':
      return 10 * 10;
    default:
      // shape 被收窄为 'triangle' 以外的类型
      // 如果后续新增了 Shape 的成员但忘记在这里处理，TS 会报错
      const exhaustiveCheck: never = shape;
      throw new Error('未处理的形状: ' + exhaustiveCheck);
  }
}
```

当 `Shape` 联合类型被新增成员（比如加了 `'hexagon'`）时，`default` 分支的 `shape` 不会被收窄为 `never`，赋值语句会抛出编译错误。这就是 `never` 在类型系统中最有价值的应用——保障分支覆盖的完整性。

### 一句话区分

函数能正常执行结束吗？能结束但没有业务上需要使用的返回值 → `void`。函数不可能正常结束（抛异常、死循环），或某个值在逻辑上不可能存在 → `never`。

### 一个容易混淆的场景

```typescript
const result: void = console.log('hello'); // console.log 的返回类型是 void
// result 的值是 undefined
```

`console.log` 执行完毕并返回了 `undefined`，所以它的类型是 `void`，不是 `never`。`never` 的核心标志是"执行流在此处中止"——程序不会走到调用点的下一行。
