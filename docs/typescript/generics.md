# TypeScript 泛型详解

### 泛型是什么

泛型（Generics）将类型本身作为参数，在定义时不锁定具体类型，在调用时才由编译器推导。它让函数、接口、类可以在保持类型安全的同时，适用于多种不同的数据类型。

```typescript
function identity<T>(value: T): T {
  return value;
}

const name = identity('hello');   // T 推导为 string，返回值类型为 string
const count = identity(42);       // T 推导为 number
const user  = identity({ id: 1 }); // T 推导为 { id: number }
```

调用 `identity` 时不需要手动标注 `T`，编译器会从实参的类型自动推导。泛型会"记住"调用时的具体类型，并把这个信息贯穿到参数和返回值中。这与用 `any` 的根本区别在于：泛型在编译后保留了类型信息，后续对返回值的操作仍然享有完整的类型检查。

### 约束泛型范围

有时泛型参数不能是任意类型，必须满足特定的结构约束。通过 `extends` 关键字可以限制泛型参数的合法范围：

```typescript
function getLength<T extends { length: number }>(input: T): number {
  return input.length;
}

getLength('hello');      // string 有 length，通过
getLength([1, 2, 3]);    // array 有 length，通过
getLength(123);           // ❌ number 没有 length 属性
```

联合类型也可以作为约束：

```typescript
function processValue<T extends string | number>(value: T): T {
  return value;
}
```

在 Vue 开发中常见的用法——约束 ref 的类型参数：

```typescript
const dialogRef = ref<HTMLElement | null>(null);
// T 被约束为 HTMLElement | null
```

### 泛型接口与泛型类

泛型不仅用于函数，贯穿整个类型系统：

```typescript
// 泛型接口
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 使用
type UserResponse = ApiResponse<{ userId: number; nickname: string }>;
type ListResponse = ApiResponse<string[]>;
```

```typescript
// 泛型类
class StateManager<T> {
  private state: T;

  constructor(initialValue: T) {
    this.state = initialValue;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
  }
}
```

### extends 的多重角色

`extends` 在 TypeScript 中有三种不同的含义，容易混淆但各自职责分明：

**类继承**——与 JavaScript 原生语义一致：

```typescript
class Animal {
  eat() {}
}

class Dog extends Animal {
  bark() {}
}
```

**接口继承**——扩展接口的成员：

```typescript
interface Nameable {
  name: string;
}

interface Employee extends Nameable {
  employeeId: number;
}
```

**泛型约束与条件类型**——编译时根据类型做条件判断：

```typescript
type IsString<T> = T extends string ? 'Yes' : 'No';

type Case1 = IsString<string>; // 'Yes'
type Case2 = IsString<number>; // 'No'
```

### keyof 与泛型约束的结合

一种常见需求是限制泛型参数必须是某个接口中已有的属性名：

```typescript
interface User {
  name: string;
  age: number;
  gender: string;
}

function getUserProperty<T extends keyof User>(key: T): string {
  // key 只能是 'name' | 'age' | 'gender'
  return key;
}

getUserProperty('name');   // 通过
getUserProperty('email');  // ❌ 'email' 不是 User 的属性名
```

`keyof User` 得到了 `'name' | 'age' | 'gender'` 这个字面量联合类型，`T extends keyof User` 将泛型参数限制在这个范围内。这在编写类型安全的工具函数时频繁使用，例如根据属性名从对象中取值并保留精确类型。

### 默认泛型参数

泛型也可以指定默认值：

```typescript
function wrap<T = string>(value: T): T {
  return value;
}

wrap('hello'); // T 默认为 string
wrap(42);      // 覆盖为 number
```

当未显式指定类型参数且编译器无法从实参推导时，会回退到默认类型。这在不希望强制调用方每次都写类型参数时提供了便利。
