# JavaScript 类型转换

### 显式类型转换

**转字符串**：`String()`、`.toString()`，以及数值与空字符串拼接 `num + ""`。

**转数字**：`Number()`、`parseInt()`、`parseFloat()`，或者使用一元 `+` 运算符——`+"123"` 是最简洁的字符串转数值写法。

**转布尔值**：`Boolean()`。以下六个值会被转为 `false`，其他所有值都转为 `true`：

- `false`、`0`、`-0`、`0n`（BigInt 零）
- `""`（空字符串）、`null`、`undefined`、`NaN`

```js
Boolean("");       // false
Boolean(" ");      // true —— 含空格的字符串是非空字符串
Boolean([]);       // true —— 空数组是对象
Boolean({});       // true —— 空对象也是对象
```

需要注意空数组和空对象都是真值，这与直觉可能不符。

### 隐式类型转换的触发规则

**`+` 运算符**：只要有一个操作数是字符串，另一个会被转为字符串后拼接。如果两个都不是字符串，则转为数字进行加法。

```js
1 + "2";         // "12"
"hello" + 5;     // "hello5"
true + 1;        // 2 —— 两者都不是字符串，true 转为 1
null + 1;        // 1 —— null 转为 0
undefined + 1;   // NaN —— undefined 转为 NaN
```

**`-`、`*`、`/` 运算符**：这些运算符没有字符串重载，一律将操作数转为数字后运算。

```js
"5" - 2;       // 3
"10" * "2";    // 20
"3.14" * 2;    // 6.28
```

**`==` 宽松相等**：优先往数字方向转换，详细规则在[== 和 === 的本质区别](/basics/equality-comparison)中展开。

**逻辑运算符 `&&` 和 `||`**：不会将结果转为布尔值返回，而是返回短路时的原值。求值时会对每个操作数执行 ToBoolean 判断。

```js
0 || "hello";     // "hello" —— 0 被判定为 false，"hello" 被返回
1 || "hello";     // 1 —— 1 被判定为 true，短路返回 1
1 && "world";     // "world" —— 1 判定为 true，继续求值并返回 "world"
0 && "world";     // 0 —— 0 判定为 false，短路返回 0
```

### 对象到原始值的转换

当对象参与运算时，引擎会调用 `ToPrimitive` 抽象操作。如果上下文期望数字（比如减法），先尝试 `valueOf()` 再尝试 `toString()`；如果上下文期望字符串（比如模板字符串），顺序相反。

```js
const obj = {
  valueOf() { return 42; },
  toString() { return "hello"; }
};

obj + 1;       // 43 —— valueOf 优先
`${obj}`;      // "hello" —— toString 优先（模板字符串期望字符串）
```

`Date` 是例外——它在 `ToPrimitive` 中始终优先调用 `toString()`。
