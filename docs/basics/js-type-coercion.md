# JavaScript 类型转换：显式 vs 隐式


### 强制类型转换：你说了算

**转字符串：** `String()` 或 `.toString()`
**转数字：** `Number()`、`parseInt()`、`parseFloat()`，最简单的写法是 `+str`
**转布尔：** `Boolean()`，`0`、`""`、`null`、`undefined`、`NaN` 是 falsy，其他都是 truthy

```javascript
String(123);        // "123"
Number('456');      // 456
parseInt('42px');   // 42，parseInt 会尽量解析
+'3.14';            // 3.14，最简洁的数字转换
Boolean('hello');   // true
Boolean(0);         // false
```

### 隐式类型转换：JS 帮你做决定

**`+` 运算符：** 只要有一边是字符串，另一边就转字符串然后拼接。

```javascript
1 + '2';       // "12"
'hello' + 5;   // "hello5"
```

反过来，想快速把数字转字符串，`num + ''` 是最短写法；想快速把字符串转数字，`+str` 是最短写法。

**`-`、`*`、`/` 运算符：** 都会尝试把操作数转成数字。

```javascript
'5' - 2;       // 3
'10' * '2';    // 20
'3.14' * 2;    // 6.28
```

**`==` 宽松比较：** 会先往数字方向转换再比较。

```javascript
1 == '1';      // true，'1' 转成 1
true == 1;     // true，true 转成 1
null == undefined; // true，特殊规则
```

**`||` 和 `&&`：** 不是返回布尔值，而是返回其中一个操作数。

```javascript
0 || 'hello';  // "hello"，0 是 falsy，取第二个
1 && 'world';  // "world"，1 是 truthy，取第二个
0 && 'world';  // 0，0 是 falsy，短路返回
```

