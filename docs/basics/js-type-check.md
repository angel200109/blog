# JavaScript 类型判断三剑客

## 简介

JS 里判断类型有三个常用方法：`typeof`、`instanceof`、`Object.prototype.toString.call()`。它们各有各的盲区和特长，组合使用才是王道。

## 核心概念

### typeof：简单粗暴但有坑

`typeof` 对原始类型基本准确，除了那个臭名昭著的 `typeof null === "object"`。对引用类型，除了函数返回 `"function"`，其他一律返回 `"object"`——数组、日期、正则统统分不出来。

```javascript
typeof 42;          // "number"
typeof 'hello';     // "string"
typeof null;        // "object" ← 永远的坑
typeof {};          // "object"
typeof [];          // "object" ← 分不出数组
typeof function(){};// "function" ← 唯一的特例
```

**一句话总结：适合判断原始类型（除了 null），不适合区分引用类型。**

### instanceof：顺着原型链查户口

`instanceof` 检查的是对象的原型链上有没有某个构造函数的 `prototype`。对原始类型完全无效，但对引用类型很管用。

```javascript
[] instanceof Array;          // true
new Date() instanceof Date;   // true
42 instanceof Number;         // false ← 原始类型不适用
```

但有个坑：`instanceof` 在多窗口（iframe）环境下会失效，因为不同窗口的 `Array.prototype` 是不同的引用。

### Object.prototype.toString.call()：终极武器

这个方法是唯一能准确区分所有类型的家伙。它返回 `"[object Type]"` 字符串，Type 就是内部的类型标签。

```javascript
Object.prototype.toString.call(42);        // "[object Number]"
Object.prototype.toString.call('hello');   // "[object String]"
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call(new Date());// "[object Date]"
Object.prototype.toString.call(null);      // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

为什么传个数字也能工作？因为 `42` 被自动装箱成了 `new Number(42)`，才能调用 `toString` 方法。

### 如何区分原始 Number 和 new Number？

`toString.call` 对 `42` 和 `new Number(42)` 都返回 `"[object Number]"`，分不出来。这时用 `typeof` 或 `instanceof` 配合判断：

```javascript
const a = 42;
const b = new Number(42);

typeof a;     // "number"  ← 原始类型
typeof b;     // "object"  ← 包装对象

a instanceof Number; // false
b instanceof Number; // true
```

## 实战场景

写一个万能的类型判断函数：

```javascript
function getType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  // 对 null/undefined 特殊处理避免装箱开销
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

getType([]);        // "array"
getType(new Date());// "date"
getType(/regex/);   // "regexp"
```

## 总结

- 判断原始类型 → `typeof`（别忘了 null 的坑）
- 判断引用类型 → `instanceof`（注意跨窗口限制）
- 需要精确判断 → `Object.prototype.toString.call()`
- 三者配合，天下无敌
