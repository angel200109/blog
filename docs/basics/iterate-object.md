# 遍历 JS 对象的四种方式，别再搞混了

```javascript
const obj = { a: 1, b: 2, c: 3 };
```

遍历这么个简单对象，JS 给了你好几种方法。选错的话要么漏属性要么多出来不该有的。

## `for...in` —— 会爬原型链

```javascript
for (let key in obj) {
  console.log(key, obj[key]); // a 1, b 2, c 3
}
```

`for...in` 遍历的是对象**自身 + 原型链**上所有可枚举属性。如果对象的原型上有东西，也会被遍历出来：

```javascript
const parent = { school: 'GZHU' };
const student = Object.create(parent);
student.no = '2112406055';

for (let key in student) {
  console.log(key); // no, school —— school 来自原型
}
```

想只拿自身属性，得配合 `hasOwnProperty`：

```javascript
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}
```

## `Object.keys()` —— 只拿自身的

```javascript
const keys = Object.keys(obj); // ['a', 'b', 'c']
keys.forEach(key => console.log(key, obj[key]));
```

只返回自身可枚举属性，不碰原型链。这是遍历对象属性的主流方式。

**注意**：`Object.keys()` 不返回 Symbol 属性。如果你用 Symbol 做了 key，它会被忽略。

## `Object.entries()` —— 键值对一把梭

```javascript
const entries = Object.entries(obj); // [['a',1], ['b',2], ['c',3]]
entries.forEach(([key, value]) => console.log(key, value));
```

解构一把拿 key 和 value，写起来舒服。同样只返回自身可枚举属性。

## `Reflect.ownKeys()` —— 最全

```javascript
Reflect.ownKeys(obj).forEach(key => console.log(key, obj[key]));
```

这个方法返回对象**所有自身属性**，包括：
- 字符串属性
- Symbol 属性
- 不可枚举属性

是覆盖面最广的遍历方式，但日常用得少。适合写工具函数或需要确保不漏属性的场景。

## 一句话总结

- 遍历普通对象 → `Object.keys()` 或 `Object.entries()`
- 需要包括 Symbol → `Reflect.ownKeys()`
- 需要原型链属性 → `for...in`（记得加 `hasOwnProperty`）
