# prototype、__proto__ 和原型链

## 简介

JS 的继承机制跟 Java、C++ 完全不同——它不是基于"类"，而是基于"原型"。`prototype`、`__proto__`、原型链这三个概念搞清楚了，JS 对象模型的底层逻辑就通了。

## 核心概念

### prototype：函数才有的属性

只有**函数**（准确说是构造函数）才有 `prototype` 属性。它是一个对象，存放所有实例共享的方法和属性。

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person("Alice");
person1.sayHello(); // "Hello, my name is Alice"
```

把方法挂 `prototype` 上而不是构造函数内，所有实例共用同一个方法引用，省内存。

### __proto__：对象都有的属性

`__proto__` 指向**构造该对象的构造函数的 prototype**。注意不是指向构造函数本身。

```javascript
console.log(person1.__proto__ === Person.prototype);     // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__);                  // null
```

### 原型链：逐层向上查找

当你访问 `obj.prop` 时，JS 先在对象自身找，找不到就沿着 `__proto__` 往上一层找，直到找到或者到 `null` 为止。

```javascript
function Person(name) {
  this.name = name;
  this.a = 1;
}
const person = new Person("angel");

Person.prototype.b = 2;
Object.prototype.c = 3;

console.log(person.a); // 1 （自身属性）
console.log(person.b); // 2 （Person.prototype）
console.log(person.c); // 3 （Object.prototype，再往上一层）
console.log(person.d); // undefined （整个原型链都没找到）
```

这条链就是：`person → Person.prototype → Object.prototype → null`

### Object.create 的情况

没有构造函数的时候，也可以手动指定原型：

```javascript
const person = { name: "angel" };
const student = Object.create(person);
student.no = "2112406055";

console.log(student.__proto__ === person); // true
console.log(person.__proto__ === Object.prototype); // true
```

## 总结

两个公式记住就行：`实例.__proto__ === 构造函数.prototype`；`构造函数.prototype.__proto__ === Object.prototype`；`Object.prototype.__proto__ === null`。原型链就是按这个方向一层层找属性。
