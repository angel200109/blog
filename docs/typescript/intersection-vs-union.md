# TS 交叉类型与联合类型

### 联合类型：一个值可以是多种类型之一

联合类型用 `|` 分隔多个候选类型，表示变量在运行时可能是其中任意一种：

```typescript
type ApiStatus = "loading" | "success" | "error";

function renderStatus(status: ApiStatus) {
  switch (status) {
    case "loading": return "加载中...";
    case "success": return "加载完成";
    case "error":   return "加载失败";
  }
}
```

联合类型的变量在未经类型缩窄前，只能访问所有成员类型共有的属性：

```typescript
function formatId(id: string | number) {
  // id.toUpperCase();  // ❌ number 没有 toUpperCase
  if (typeof id === "string") {
    return id.toUpperCase();   // ✅ 类型缩窄为 string
  }
  return id.toString();        // ✅ 缩窄为 number
}
```

### 交叉类型：一个值同时具备多个类型的属性

交叉类型用 `&` 连接，要求变量同时满足所有成员类型的约束，即"合并"多个类型：

```typescript
interface Nameable {
  name: string;
}

interface Identifiable {
  id: number;
}

type Entity = Nameable & Identifiable;

const product: Entity = {
  id: 1001,
  name: "机械键盘"
  // 必须同时包含 id 和 name
};
```

交叉类型在混入（Mixin）模式和组合多个接口的场景中非常实用：

```typescript
type AdminUser = UserProfile & AdminPermissions & AuditFields;

// AdminUser 需要同时满足三个接口的所有属性
```

需要注意，如果交叉的成员类型中存在同名但类型不兼容的属性，结果会是 `never`：

```typescript
type Conflict = { value: string } & { value: number };
// value 的类型被解析为 string & number → never
```

### 联合与交叉的对比选择

联合和交叉看似是简单的类型运算符，但它们的语义指向不同的设计意图：

| 维度 | 联合类型 `A \| B` | 交叉类型 `A & B` |
|------|-------------------|-------------------|
| 语义 | "或"——值是 A 或 B 中的一种 | "且"——值同时是 A 和 B |
| 属性访问 | 只能访问共有的属性 | 可以访问所有属性 |
| 典型场景 | 函数参数多态、状态枚举 | 类型组合、Mixin、接口合并 |
| 缩窄要求 | 需要类型守卫缩窄后才能使用特有属性 | 不需要缩窄，天然满足所有约束 |

选择时的一个判断标准：如果变量在运行时的实际形态是"非此即彼"，用联合类型；如果是在已有类型上叠加更多能力，用交叉类型。

```typescript
// 联合：API 响应可能成功也可能失败
type ApiResult<T> = 
  | { status: "ok"; data: T }
  | { status: "error"; message: string };

// 交叉：带时间戳的搜索结果
type TimestampedResult<T> = T & { timestamp: number };
```
