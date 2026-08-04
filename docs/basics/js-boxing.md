# JS 装箱机制：原始值为什么能调用方法


### 什么是装箱？

当你对原始类型调用方法或访问属性时，JS 引擎会自动把它临时包装成对应的对象，用完了再扔掉。这个过程叫装箱。

```javascript
const str = 'hello';
console.log(str.toUpperCase());  // "HELLO"

// 背后等价于：
const temp = new String(str);
const result = temp.toUpperCase();
temp = null;  // 用完销毁
```

### 装箱的触发时机

访问 `.` 属性、调用方法时都会触发。但 `instanceof` 不会：

```javascript
const a = 1;

// 触发了装箱 → 临时变成 new Number(1)
console.log(a.__proto__ === Number.prototype); // true

// 没有触发装箱 → 1 还是原始类型
console.log(a instanceof Number); // false
```

`__proto__` 是对象的属性，访问它就触发了装箱，所以返回 true。`instanceof` 是检查原型链的操作，原始类型没有原型链，直接返回 false。

### 装箱也发生在数字方法上

```javascript
const num = 3.14159;
console.log(num.toFixed(2)); // "3.14"
// 同样是临时装箱成 new Number(3.14159)
```

### 包装对象 vs 原始值

```javascript
const a = 42;           // 原始值
const b = new Number(42); // 包装对象

typeof a;               // "number"
typeof b;               // "object"

a === b;                // false
a == b;                 // true（b 被拆箱了）
```

日常开发别用 `new Number()`、`new String()`，除非你想给自己挖坑。

