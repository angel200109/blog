# == 和 === 的本质区别


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

