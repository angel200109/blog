# 创建 JS 对象的五种方式，以及它们的原型链

写 JS 天天跟对象打交道，但你真的清楚每种创建方式的区别吗？来捋一遍。

## 1. 字面量 —— 最常用

```javascript
const person = {
  name: 'Alice',
  age: 30,
  sayHello() { console.log('Hello!'); }
};

console.log(person.__proto__ === Object.prototype); // true
```

底层等价于 `new Object()`，原型链是 `person → Object.prototype → null`。日常写业务代码 90% 用这个就够了。

## 2. 构造函数 + `new`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const p = new Person('Alice', 30);
console.log(p.__proto__ === Person.prototype);       // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

原型链：`p → Person.prototype → Object.prototype → null`。`new` 做了四件事：创建空对象、绑定原型、执行构造函数、返回对象。

## 3. `Object.create()` —— 精确控制原型

```javascript
const person = Object.create(null); // 不继承任何东西
person.name = 'Alice';
console.log(person.__proto__); // undefined —— 你没有看错
```

`Object.create(null)` 创建的是"纯净"对象，连 `toString`、`hasOwnProperty` 都没有。适合用作字典/Map（在 `Map` 出现之前），避免原型链上的属性干扰 `for...in` 遍历。

```javascript
const parent = { type: 'human' };
const child = Object.create(parent);
child.name = 'Bob';
console.log(child.type); // 'human' —— 从原型继承
```

## 4. 工厂函数

```javascript
function createPerson(name, age) {
  return { name, age };
}
```

简单直接，就是返回一个字面量对象。没法用 `instanceof` 判断类型，每个对象的方法都是独立的（不共享）。

## 5. `class` —— ES6 语法糖

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  sayHello() {
    console.log(`Hi, I'm ${this.name}`);
  }
}

const p = new Person('Alice', 30);
```

本质还是原型继承，只是语法更友好。方法定义在原型上，所有实例共享。

## 小结

| 方式 | 用在哪 |
|------|--------|
| 字面量 `{}` | 日常 90% 的场景 |
| `Object.create(null)` | 需要纯净字典时 |
| 构造函数 / class | 需要多个共享方法的实例 |
| 工厂函数 | 简单场景，不需要 `instanceof` |
