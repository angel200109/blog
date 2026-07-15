# == 和 === 的本质区别

## 简介

面试必考题。简单说 `===` 是严格比较，类型不同直接 false；`==` 会先做类型转换再比较。但懂了规则才算真的会。

## 核心概念

### === 严格相等：简单粗暴

类型不同 → `false`。类型相同 → 比较值。没有任何花活。

```javascript
1 === '1';           // false，类型不同
true === 1;          // false，类型不同
null === undefined;  // false，类型不同
0 === false;         // false，类型不同
```

### == 宽松相等：一套复杂的转换规则

`==` 比较时 JS 会按以下顺序尝试转换（往数字方向转）：

1. 类型相同 → 直接比较
2. `null == undefined` → 永远 `true`（这是特殊规则）
3. 一个是 `number`，一个是 `string` → 把字符串转数字再比
4. 一个是 `boolean` → 把布尔转数字再比（`true` → `1`，`false` → `0`）
5. 一个是对象 → 调用 `valueOf()` 或 `toString()` 拿原始值再比
6. 其他情况 → `false`

```javascript
'10' == 10;          // true，'10' → 10
true == 1;           // true，true → 1
[1] == 1;            // true，[1] → '1' → 1
[] == '';            // true，[] → ''
[] == 0;             // true，[] → '' → 0
Symbol() == 0;       // false
```

### valueOf 和 toString 在 == 中的作用

当对象和原始类型比较时，JS 会调用对象的 `valueOf()` 获取原始值。如果没拿到合适的值，再调用 `toString()`。这也是为什么自定义对象可以控制比较行为。

## 实战场景

日常开发基本只用 `===`。只有在少数场景 `==` 才省事：

```javascript
// 同时判断 null 和 undefined
if (value == null) {
  // value 是 null 或 undefined 都会进来
}

// 不要这样！（虽然能跑，但不直观）
if (input == true) { ... }  // 任何 truthy 值都会匹配
if (input == false) { ... } // 任何 falsy 值都会匹配
```

上面这两行看起来像是在判断 `true/false`，实际上 `'hello' == true` 也是 false，因为 `true` 先转成 `1`，`'hello'` 转成 `NaN`，`NaN == 1` 是 false——你以为的判断布尔值其实在做数字比较，非常反直觉。

## 总结

能用 `===` 就用 `===`。`==` 只在 `value == null` 这种场景有价值，其他时候只会让代码更难读。
