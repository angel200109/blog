# 交叉类型和联合类型


### 联合类型：就是其中之一

变量可以是你列出的多个类型中的任意一个：

```ts
let value: string | number

value = 'hello'   // ✅
value = 42        // ✅
value = true      // ❌ boolean 不在联合中
```

使用联合类型的变量时，只能访问**所有成员共有的属性**：

```ts
function format(value: string | number) {
  value.toString()  // ✅ string 和 number 都有 toString
  value.length      // ❌ number 没有 length
  value.toFixed()   // ❌ string 没有 toFixed
}

// 必须缩窄类型后才能访问独有的属性
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // ✅ 这里确定是 string
  }
  return value.toFixed(2)       // ✅ 这里确定是 number
}
```

### 交叉类型：同时具备所有

`&` 把多个类型"合"在一起，结果必须同时满足所有条件：

```ts
type Nameable = { name: string }
type Ageable = { age: number }

type Person = Nameable & Ageable

const person: Person = {
  name: 'tom',   // ✅ 必须有
  age: 25,       // ✅ 必须有
}
// 缺任何一个都会报错
```

### 类型缩窄

联合类型 + 类型缩窄是 TS 最常用的组合：

```ts
type Shape = Circle | Square

interface Circle { kind: 'circle'; radius: number }
interface Square { kind: 'square'; sideLength: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2  // shape 缩窄为 Circle
    case 'square':
      return shape.sideLength ** 2        // shape 缩窄为 Square
  }
}
```

