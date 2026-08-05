# TS 类型断言

### 类型断言的作用

类型断言（Type Assertion）是手动告知 TypeScript 编译器一个值的具体类型，绕过编译器的类型推导。它不改变运行时的值，也不执行任何类型转换——纯粹是编译期的声明。

```typescript
// 从 DOM 获取元素，TS 只知道它是 HTMLElement | null
const canvas = document.getElementById("chart-canvas");

// 断言为 HTMLCanvasElement，才能访问 getContext
const ctx = (canvas as HTMLCanvasElement).getContext("2d");
```

类型断言有两种语法，效果完全相同：

```typescript
const username = (userInput as string).trim();     // as 语法（推荐）
const username = (<string>userInput).trim();       // 尖括号语法（与 JSX 冲突，不推荐在 .tsx 中使用）
```

### 常见使用场景

**处理第三方库或 API 返回值。** 当外部数据的类型定义不完整或不存在时，用断言补全类型信息：

```typescript
interface PaymentResponse {
  orderId: string;
  amount: number;
  paidAt: string;
}

// 假设第三方 SDK 返回 any 类型
const rawResponse = thirdPartySDK.getPaymentResult("order-123");
const payment = rawResponse as PaymentResponse;
console.log(payment.orderId);
```

`as` 断言在此时没有运行时验证能力。如果 `rawResponse` 实际结构不匹配 `PaymentResponse`，后续代码会在运行时出错，但编译期不会报警。对于不可信的外部数据，断言应该配合运行时校验使用。

**DOM 操作中的元素类型缩窄。**

```typescript
const modal = document.querySelector(".modal-dialog") as HTMLDivElement;
const submitBtn = document.querySelector<HTMLButtonElement>("#submit");
// querySelector 的泛型参数本质上也是一种类型断言
```

**联合类型的缩窄。** 在已经通过逻辑确认了具体类型分支后，用断言消除编译器的不确定性：

```typescript
type TaskStatus = "todo" | "in-progress" | "done";

function archiveTask(status: TaskStatus) {
  const allStatuses: TaskStatus[] = ["todo", "in-progress", "done"];

  if (allStatuses.includes(status)) {
    // 此时已确认 status 是合法值
    // 但 TS 类型缩窄不追踪 includes 的逻辑
    const labelMap: Record<TaskStatus, string> = {
      todo: "待办",
      "in-progress": "进行中",
      done: "已完成"
    };
    return labelMap[status as TaskStatus];  // 断言避免 TS 报错
  }
}
```

### 断言的限制与替代方案

类型断言不是万能的。TypeScript 只允许在类型存在重叠关系的方向上进行断言：

```typescript
const value = "hello" as number;  // ❌ 错误：string 和 number 没有重叠
```

需要双重断言才能绕过这个限制（但不推荐）：

```typescript
const value = "hello" as unknown as number;  // ⚠️ 可以编译，但不安全
```

比断言更安全的方式是类型守卫和运行时校验：

```typescript
function isPaymentResponse(obj: unknown): obj is PaymentResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "orderId" in obj &&
    "amount" in obj
  );
}

const rawData = await response.json();
if (isPaymentResponse(rawData)) {
  // rawData 在这个分支里被 TS 识别为 PaymentResponse
  console.log(rawData.orderId);
}
```

类型守卫在运行时实际检查数据结构，既提供了类型安全，也让代码意图更加明确。断言应该在"开发者比编译器更清楚类型"的场景下使用，而不是用来绕过类型系统。
