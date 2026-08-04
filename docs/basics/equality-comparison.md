# == 和 === 的本质区别

### `===`：先比类型，再比值

严格相等不做类型转换。如果类型不同，直接返回 `false`；类型相同才进入值比较。

- `NaN === NaN` 返回 `false`——这是 IEEE 754 的规定，需要用 `Number.isNaN()` 或 `Object.is()` 判断
- `+0 === -0` 返回 `true`——两者在数值上相等

```js
1 === "1";           // false —— 类型不同
true === 1;          // false
null === undefined;  // false —— 类型不同
0 === false;         // false
```

### `==`：优先往数字方向转换

宽松相等的转换规则由 ECMAScript 规范明确定义，核心策略是尽量将操作数转为数字再比较：

1. 类型相同 → 直接按 `===` 比较
2. `null == undefined` → 返回 `true`（规范特例）
3. 一方是 `number`，另一方是 `string` → 将字符串转为数字
4. 一方是 `boolean` → 先转数字再比较
5. 一方是 `object`，另一方是原始类型 → 调用对象的 `valueOf()` 或 `toString()` 转为原始值
6. 其他情况 → `false`

```js
null == undefined;   // true —— 特例
1 == "1";            // true —— "1" 转 1
"10" == 10;          // true
true == 1;           // true —— true 转 1
false == 0;          // true —— false 转 0
[1] == 1;            // true —— [1].toString() -> "1" -> 1
[] == "";            // true —— [].toString() -> ""
Symbol() == 0;       // false —— Symbol 不能转数字
```

`null == undefined` 的特殊性在于：规范将这一对相等关系单独处理，不做类型转换就直接返回 `true`。但 `null == 0`、`undefined == 0` 都返回 `false`——它们只和彼此宽松相等，不和其他值相等。

### 对象参与 `==` 的转换细节

当对象一侧与原始类型比较时，引擎会调用 `ToPrimitive`：

```js
const obj = {
  valueOf() { return 42; },
  toString() { return "hello"; }
};

obj == 42;    // true —— valueOf 返回 42
obj == "42";  // false —— valueOf 返回 42（数字），"42" 转 42，但 42 != 42? 不对...
```

实际上 `obj == "42"` 的执行路径是：`obj` 通过 `valueOf()` 转成 `42`（数字），然后比较 `42 == "42"`，字符串 `"42"` 转为 `42`，最终 `42 == 42` → `true`。

### 实际开发中的选择

在代码审查层面，绝大多数团队规范要求使用 `===`。`==` 的隐式转换会掩盖类型错误——如果 `apiResponse.count` 本应是数字却返回了字符串 `"3"`，`===` 能暴露问题，而 `==` 会悄悄通过。

```js
// 唯一被广泛接受的 == 使用场景：同时判断 null 和 undefined
if (value == null) {
  // 等价于 value === null || value === undefined
}
```

ESLint 的 `eqeqeq` 规则默认强制使用 `===`，唯一的例外就是允许 `== null` 检查。
