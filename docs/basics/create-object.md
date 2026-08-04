# 创建 JS 对象的五种方式

### 对象字面量

```js
const user = {
  name: 'Alice',
  age: 28,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
};

console.log(user.__proto__ === Object.prototype); // true
```

字面量是创建单个对象最直接的方式。原型链自动指向 `Object.prototype`，无需额外的构造函数调用。适合一次性对象、配置项和数据结构，但不适合需要批量创建同结构对象的场景。

### 构造函数 + new

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const person1 = new Person('Alice', 28);
const person2 = new Person('Bob', 32);

// 原型链验证
person1.__proto__ === Person.prototype; // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__; // null
```

`new` 操作符做了四件事：创建一个空对象、将空对象的 `[[Prototype]]` 指向构造函数的 `prototype`、将 `this` 绑定到新对象并执行构造函数、返回新对象。

注意：构造函数内的 `this.greet` 是实例方法——每个实例都会持有一份独立的函数副本。如果希望所有实例共享同一方法，应将其定义在 `Person.prototype` 上：

```js
Person.prototype.greetShared = function () {
  console.log(`Hello, I'm ${this.name}`);
};
```

### Object.create

```js
const parentConfig = {
  appName: 'MyApp',
  logLevel: 'info',
};

const devConfig = Object.create(parentConfig);
devConfig.port = 3000;

console.log(devConfig.appName); // 'MyApp' —— 来自原型链
console.log(devConfig.hasOwnProperty('port')); // true
console.log(devConfig.hasOwnProperty('logLevel')); // false
```

`Object.create(proto)` 创建一个新对象，并将新对象的 `[[Prototype]]` 显式指向传入的 `proto`。这种方式比构造函数更灵活——可以直接指定任意对象作为原型，而不需要经过 `prototype` 这一层。

特殊用法：`Object.create(null)` 创建"纯净对象"——没有 `__proto__`、没有继承自 `Object.prototype` 的任何方法（`toString`、`hasOwnProperty` 等），适合用作纯字典/哈希表。

### 工厂函数

```js
function createUser(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hello, I'm ${this.name}`);
    },
  };
}

const user1 = createUser('Alice', 28);
const user2 = createUser('Bob', 32);
```

工厂函数只是普通函数，返回一个对象。它不涉及 `new`、`this` 和原型链设置，使用门槛最低。缺点是每个对象的方法独立存在（无法通过原型共享），且在需要 `instanceof` 判断的场景下不如构造函数直观。

### class 语法

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 原型方法——所有实例共享
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 静态方法——只能通过类名调用
  static fromJSON(json) {
    const data = JSON.parse(json);
    return new Person(data.name, data.age);
  }
}

class Student extends Person {
  constructor(name, age, school) {
    super(name, age); // 调用父类构造函数
    this.school = school;
  }

  greet() {
    super.greet(); // 调用父类方法
    console.log(`I study at ${this.school}`);
  }
}

const student = new Student('Carol', 20, 'MIT');
```

`class` 是 ES6 引入的语法糖，底层依然是构造函数 + 原型链。`constructor` 中的赋值产生实例属性，`constructor` 之外的函数定义在 `Person.prototype` 上，所有实例共享。`static` 方法挂载在类本身，类似 `Array.isArray`。

`extends` 实现继承，`super` 用于调用父类的构造函数和方法。与 ES5 的寄生组合继承相比，`class` 的语法更清晰，原型链关系更直白。

### 选型建议

| 方式 | 适用场景 |
|------|---------|
| 字面量 | 一次性对象、配置、数据载体 |
| 构造函数 + new | 需要 `instanceof`、数量较多的实例 |
| Object.create | 精细控制原型、创建纯净对象 |
| 工厂函数 | 无需 `new`/`this`、偏好函数式风格 |
| class | 面向对象设计、继承体系 |

日常开发中，字面量和 `class` 覆盖了绝大多数需求。`Object.create` 和工厂函数更常见于库和工具函数内部。
