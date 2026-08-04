# TypeScript 中 any 与 unknown 的区别

### 一句话区分

`any` 是"关闭类型检查"，`unknown` 是"还不知道是什么类型，先不让你用"。两者都能接收任意类型的值，但后续行为截然相反。

### any：回到 JavaScript

`any` 类型会完全跳过编译器的类型检查。一个 `any` 类型的变量可以赋值给任意类型的变量，可以访问任意属性（无论是否存在），也可以当作函数调用——编译器不会给出任何警告。这相当于在 TypeScript 中局部退回到 JavaScript 的动态类型。

```typescript
let anyValue: any = { name: 'Tom' };

anyValue.name;           // 可以通过
anyValue.age;            // 可以通过，即使属性不存在
anyValue.getName();      // 可以通过，即使没有这个方法
```

`any` 的核心问题是它以牺牲类型安全为代价换取便利。在 `tsconfig` 中开启 `strict` 模式后，编译器会强烈建议避免使用 `any`。它的合理使用场景通常局限于迁移遗留 JavaScript 代码的过渡阶段，或者确实需要绕过类型检查的边界情况。

### unknown：安全的不确定类型

`unknown` 用于处理在编译时无法确定具体类型的值。它与 `any` 一样可以接收任意类型，但在使用上受到严格限制：不能直接访问属性、不能作为函数调用、也不能直接赋值给其他明确类型的变量——在类型被"收窄"之前，编译器禁止对 `unknown` 做任何操作。

```typescript
let unknownValue: unknown = { name: 'Tom' };

unknownValue.name;       // ❌ 类型"unknown"上不存在属性"name"
unknownValue.toString(); // ❌ 同上
```

要对 `unknown` 进行操作，必须先通过类型守卫将其收窄为具体类型：

```typescript
if (typeof unknownValue === 'object' && unknownValue !== null) {
  if ('name' in unknownValue) {
    console.log(unknownValue.name); // 通过，此时 TS 知道它有 name 属性
  }
}
```

### 最佳实践：用 unknown 接收不可信数据

从 API 响应、用户输入、第三方库返回值等不可信来源获取数据时，使用 `unknown` 是更安全的选择：

```typescript
const data: unknown = await response.json();
// 强制在使用前进行类型校验，避免运行时意外
if (typeof data === 'object' && data !== null && 'userId' in data) {
  // data 已被收窄，可以安全使用
}
```

如果用 `any` 接收同样的数据，后续代码可能在运行时才暴露问题——而 `unknown` 将校验时机提前到了编译阶段。

### 对比总结

| 维度 | `any` | `unknown` |
|------|-------|-----------|
| 赋值给其他类型 | 可以，跳过检查 | 不可以，需先收窄 |
| 访问属性 | 可以，跳过检查 | 不可以，编译报错 |
| 作为函数调用 | 可以，跳过检查 | 不可以，编译报错 |
| 安全性 | 低，禁用类型系统 | 高，强制类型收窄 |
| 典型场景 | 迁移旧代码、临时绕过 | 接收外部不可信数据 |

选择原则：能不用 `any` 就不用 `any`。不确定类型时用 `unknown`，再通过类型守卫或断言收窄；完全确定类型时直接标注具体类型。
