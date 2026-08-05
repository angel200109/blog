# TypeScript 模块化与命名空间

### 两种组织代码的方式

TypeScript 提供两种将代码拆分为独立作用域的方式：**ES 模块**（`import` / `export`）和**命名空间**（`namespace`）。

ES 模块是 ECMAScript 2015 引入的标准，通过 `export` 暴露接口，通过 `import` 引入依赖：

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from "./math";
console.log(add(1, 2));
```

命名空间是 TypeScript 特有语法，使用 `namespace` 关键字包裹相关代码，通过 `<命名空间>.<成员>` 访问：

```typescript
namespace MathUtil {
  export function add(a: number, b: number): number {
    return a + b;
  }
  export function multiply(a: number, b: number): number {
    return a * b;
  }
}

console.log(MathUtil.add(1, 2));
console.log(MathUtil.multiply(3, 4));
```

### 命名空间的历史背景

命名空间出现在 ES 模块标准化之前。当时 JavaScript 没有原生模块系统，TypeScript 引入 `namespace` 让开发者能将代码组织为逻辑分组，编译后通过 IIFE（立即执行函数表达式）实现作用域隔离。

编译后的输出大致如下：

```javascript
var MathUtil;
(function (MathUtil) {
  function add(a, b) { return a + b; }
  MathUtil.add = add;
  function multiply(a, b) { return a * b; }
  MathUtil.multiply = multiply;
})(MathUtil || (MathUtil = {}));
```

本质上是将一个对象挂在全局，用它来承载所有成员。这带来了两个问题：全局命名空间可能冲突；无法做按需加载和 Tree-shaking。

### 为什么现在几乎只用 ES 模块

ES 模块作为语言标准，得到了所有现代运行时（浏览器、Node.js、Deno）和构建工具（Vite、Webpack、esbuild）的原生支持。相比命名空间，它有以下几个关键优势：

- **编译时确定依赖关系**：`import` 语句在代码解析阶段就能确定模块依赖图，构建工具可以据此做 Tree-shaking，移除未使用代码。
- **作用域隔离更彻底**：每个模块拥有独立的顶层作用域，不需要手动 `export` 来暴露成员，也不会无意间污染全局。
- **异步加载**：浏览器环境下的 ES 模块支持异步加载，不阻塞页面渲染。
- **语言标准**：不会因为 TypeScript 的版本策略被迫迁移。

### 命名空间当前的实际用途

虽然不再推荐在新的应用代码中使用命名空间，但在以下场景中仍然有价值：

**声明文件（`.d.ts`）中组织类型**：

```typescript
declare namespace API {
  interface User {
    id: number;
    name: string;
  }
  interface Post {
    id: number;
    title: string;
    userId: number;
  }
}

function renderUser(user: API.User) { /* ... */ }
```

在声明文件中用 `namespace` 将相关的类型定义归为一组，比独立的 `interface` 更容易找到和阅读。

**为已有全局库编写类型声明**：

```typescript
declare namespace jQuery {
  function ajax(url: string, settings?: object): void;
  function get(url: string, callback: (data: unknown) => void): void;
}
```

### 模块解析策略的影响

TypeScript 的 `moduleResolution` 配置决定了编译器如何查找模块，有两个选项：

| 策略 | 说明 |
| --- | --- |
| `node` | 模拟 Node.js 的模块解析规则，支持 `node_modules`、`index.ts`、`package.json` 的 `types/main` 字段 |
| `classic` | 早期规则（已不推荐），先在同级目录查找，再向上递归，不支持 `node_modules` |

`module` 字段配置（`ESNext`、`CommonJS` 等）则决定了编译后输出哪种模块格式。在选型上，新项目使用 `"module": "ESNext"` + `"moduleResolution": "bundler"` 组合是最常见的实践。
