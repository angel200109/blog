# 模块化 vs 命名空间

## 简介

TS 有两种组织代码的方式：模块化（ES Module）和命名空间（namespace）。前者是现代标准，后者是 TS 的历史遗产——新项目不用纠结，直接用模块化。

## 核心概念

### 模块化：ES Module

使用 `import` / `export`，每个文件默认就是一个模块：

```ts
// user.ts
export interface User {
  id: number
  name: string
}

export function getUser(id: number): User {
  return { id, name: 'tom' }
}

// app.ts
import { User, getUser } from './user'

const user: User = getUser(1)
```

模块有明确的作用域，变量不会污染全局。需要什么导什么、引什么。

### 命名空间：namespace

TS 特有的语法，把所有东西包在一个对象里：

```ts
namespace MathUtil {
  export function add(a: number, b: number): number {
    return a + b
  }
  export function subtract(a: number, b: number): number {
    return a - b
  }
}

console.log(MathUtil.add(1, 2))  // 3
```

编译后会生成一个 IIFE 包裹的对象：

```js
var MathUtil;
(function (MathUtil) {
  function add(a, b) { return a + b }
  MathUtil.add = add
  function subtract(a, b) { return a - b }
  MathUtil.subtract = subtract
})(MathUtil || (MathUtil = {}))
```

### 为什么 namespace 已经过时

ES Module 出来之前，TS 用 `namespace` 和 `/// <reference>` 来组织代码、避免全局污染。现在 ES Module 已经是标准，浏览器和 Node 都原生支持，`namespace` 就没有存在的必要了。

它的几个痛点：
- 依赖关系不直观，要靠 `/// <reference>` 标签手动声明
- 打包工具对 namespace 支持不统一
- 不能做 tree-shaking
- 社区生态已经全面转向 ES Module

## 实战场景

**新项目直接 import/export**，这个没有争议。

唯一的例外是声明文件（`.d.ts`）里可能会看到 `namespace`：

```ts
// 给已有全局对象补充类型定义
declare namespace MyLib {
  function init(config: Config): void
}
```

但这不是在写业务代码，只是在声明外部库的类型——即使这样，ES Module 的声明方式更常见。

如果维护的老项目里还有 `namespace`，建议逐步迁移成 ES Module。改动不大：

```ts
// namespace 版本
namespace Utils {
  export function format(date: Date) { /* ... */ }
}

// → 改成模块
// utils.ts
export function format(date: Date) { /* ... */ }
```

## 总结

`namespace` = TypeScript 历史产物，`import/export` = 现代标准。老代码里看到 namespace 不用慌，新代码不要再写它。
