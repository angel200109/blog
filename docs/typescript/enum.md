# enum 枚举

## 简介

`enum` 是 TS 的枚举类型，给一组数值起个语义化的名字。JS 里没有原生对应物，编译后会生成额外的代码——这也是它争议比较大的原因。

## 核心概念

### 数字枚举

最常用的形式，值从 0 开始自增：

```ts
enum Role {
  Admin,   // 0
  User,    // 1
  Guest,   // 2
}

console.log(Role.Admin)  // 0
console.log(Role[0])     // 'Admin' —— 数字枚举支持反向映射
```

可以手动指定起始值：

```ts
enum Status {
  Pending = 1,
  Approved,  // 2
  Rejected,  // 3
}
```

### 字符串枚举

每个成员必须显式赋值，不支持反向映射：

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

字符串枚举没有反向映射，但值更可读，调试时能看到有意义的名字而不是数字。

### 编译结果

数字枚举编译后会生成一个双向映射对象：

```js
// TS 源码：enum Role { Admin, User, Guest }
// 编译结果：
var Role;
(function (Role) {
  Role[Role["Admin"] = 0] = "Admin"
  Role[Role["User"] = 1] = "User"
  Role[Role["Guest"] = 2] = "Guest"
})(Role || (Role = {}))
```

字符串枚举更简洁：

```js
var Direction;
(function (Direction) {
  Direction["Up"] = "UP"
  Direction["Down"] = "DOWN"
  Direction["Left"] = "LEFT"
  Direction["Right"] = "RIGHT"
})(Direction || (Direction = {}))
```

### const enum：零运行时开销

```ts
const enum Color {
  Red, Green, Blue
}

const c = Color.Red  // 编译后直接变成 var c = 0
```

`const enum` 在编译时会被内联替换为字面值，不生成任何运行时代码。但有个坑：如果你用 Babel 转译且没配好插件，`const enum` 可能不工作。

## enum 的争议

社区对 enum 的态度分化：

- **反对派**：enum 不是 JS 标准，会增加运行时开销，建议用联合类型替代
- **支持派**：可读性好，有反向映射，适合定义固定常量集

```ts
// 联合类型替代方案
type Role = 'admin' | 'user' | 'guest'
const role: Role = 'admin'

// 比 enum 更轻量，但少了反向映射和遍历能力
```

## 实战场景

状态码、角色权限、选项列表这类**值固定且需要语义化**的场景适合 enum。如果只是简单的字符串常量，用联合类型更轻量。

```ts
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.OK) { /* ... */ }
}
```

## 总结

数字枚举有反向映射，字符串枚举值可读性更好。`const enum` 零开销但依赖编译工具。如果只是需要限定值的范围，用 `type X = 'a' | 'b'` 更轻量。需要反向映射或遍历值时再用 enum。
