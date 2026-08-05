# TS 类型推断与类型注释

### 类型推断：让编译器推导类型

TypeScript 的类型推断机制会根据变量的初始值自动推导其类型。当声明并立即赋值时，通常不需要显式写出类型注解：

```typescript
let articleCount = 10;          // 推断为 number
let authorName = "angel";       // 推断为 string
let isPublished = false;        // 推断为 boolean
let tags = ["vue", "react"];    // 推断为 string[]
let createdAt = new Date();     // 推断为 Date
```

函数返回值也可以被推断：

```typescript
function getFullName(first: string, last: string) {
  return `${first} ${last}`;    // 返回值推断为 string
}
```

推断并非万能。当变量先声明后赋值，或初始值为 `null` / `undefined` 时，TypeScript 无法准确推导：

```typescript
let searchResult;                // 推断为 any
searchResult = fetchData();      // 不报错，但没有类型安全

// 对比
let searchResult: SearchResponse; // 明确类型
searchResult = fetchData();       // 类型不匹配时编译器会报错
```

### 类型注释：手动指定类型

当推断无法满足需求，或需要明确约束变量类型时，使用类型注释（Type Annotation）：

```typescript
let apiResponse: ApiResult<UserProfile>;
let config: AppConfig = { debug: false, theme: "dark" };

function parseCSV(raw: string): Array<Record<string, string>> {
  // 显式声明返回值类型，即使不写 TS 也能推断
  // 但写出来可以防止意外返回其他类型
  const lines = raw.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((row, header, i) => {
      row[header] = values[i];
      return row;
    }, {} as Record<string, string>);
  });
}
```

类型注释在以下场景中尤其必要：
- 函数参数必须显式标注类型
- 没有初始值的变量（`let query: string;`）
- 需要比推断更精确的类型约束（如字面量联合类型 `type Size = "sm" | "md" | "lg"`）
- 导出函数和公共 API 的返回值

### 选择策略

能推断的不写，该明确的不省。这条原则背后的逻辑是：减少冗余的类型书写能降低维护成本，但关键边界（函数签名、公共接口、复杂泛型）必须显式声明以确保契约清晰。

```typescript
// 过度注释：冗余
let userCount: number = 0;        // 推断已明确

// 必要注释：函数参数没有推断能力
function createUser(name: string, role: "admin" | "member"): User {
  // ...
}

// 边界注释：公共 API 的返回值类型
export function fetchUserList(): Promise<User[]> {
  return api.get("/users");
}
```

推断的正确性与注释的明确性之间，取决于代码的公共边界有多宽——越是对外的接口，越需要显式的类型契约。
