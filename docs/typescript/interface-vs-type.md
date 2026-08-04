# TypeScript 中 interface 与 type 的区别

### 共同点：都能描述对象结构

`interface` 和 `type` 在描述对象形状这件事上有大量的交集。定义一个包含姓名和年龄的用户对象，两种写法都能胜任：

```typescript
interface User {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
};
```

两者都支持扩展，只是语法不同：

```typescript
// interface 用 extends
interface Admin extends User {
  role: string;
}

// type 用交叉类型
type Admin = User & {
  role: string;
};
```

### 关键差异一：声明合并

`interface` 支持声明合并——多次定义同名的 `interface`，TypeScript 会自动将它们合并为一个：

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 最终 User 同时拥有 name 和 age
const user: User = { name: 'Tom', age: 25 }; // 通过
```

这个特性在扩展第三方库的类型定义时非常有用。例如要给 `Window` 接口追加自定义属性，只需在同名声明中添加即可。

`type` 不支持声明合并。重复定义同名的 `type` 会直接报错：

```typescript
type User = { name: string };
type User = { age: number }; // ❌ 标识符"User"重复
```

### 关键差异二：联合类型与映射类型

`type` 可以定义 `interface` 无法直接表达的类型：

```typescript
// 联合类型
type Status = 'idle' | 'loading' | 'success' | 'error';

// 元组
type Point2D = [number, number];

// 映射类型
type ReadonlyUser = Readonly<User>;

// 条件类型
type StringOrNumber<T> = T extends string ? string : number;
```

`interface` 的设计目标是描述对象的结构契约，不适合表达这些非对象类型。

### 如何选择

核心决策逻辑来自两个维度：是否需要声明合并，以及要描述的类型是纯对象结构还是包含联合/交叉/映射。

- 定义组件 Props、API 响应体、配置对象等结构化数据时，优先用 `interface`。声明合并能力在扩展第三方类型时是不可替代的优势
- 定义联合类型、元组、函数签名或需要通过映射类型变换已有类型时，用 `type`
- 对于只会在内部使用、不需要对外暴露为扩展点的对象类型，用 `type` 也无妨——两者在绝大多数日常场景中可以互换

一个偏工程的判断：项目中如果要暴露类型给外部包或插件消费，`interface` 允许使用方通过声明合并追加属性，扩展性更好。如果是内部项目且没有扩展需求，则选型自由度更大。
