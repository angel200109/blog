# 原型链实现继承

### 原型链继承的基本模式

JavaScript 的继承基于原型链：将子类型的 `prototype` 指向父类型的一个实例，子类型的实例就能沿原型链访问父类型原型上的属性和方法。

```javascript
function Vehicle(brand) {
  this.brand = brand;
  this.parts = ["engine", "wheels"];
}

Vehicle.prototype.start = function () {
  return `${this.brand} 启动`;
};

function Car(brand, model) {
  Vehicle.call(this, brand);      // 借用构造函数继承属性
  this.model = model;
}

Car.prototype = new Vehicle();     // 原型链继承方法
Car.prototype.constructor = Car;   // 修复 constructor 指向

const tesla = new Car("Tesla", "Model 3");
const bmw = new Car("BMW", "X5");

console.log(tesla.start());        // "Tesla 启动"
console.log(tesla instanceof Car);     // true
console.log(tesla instanceof Vehicle); // true
```

这种方式的不足在于：父类型的引用类型属性会被所有子实例共享——`tesla.parts` 和 `bmw.parts` 指向同一个数组。同时，创建子实例时无法向父构造函数动态传参。

### 借用构造函数

在子类型构造函数中直接调用父类型构造函数，使用 `call` 或 `apply` 绑定 `this`，实现属性的独立拷贝：

```javascript
function Vehicle(brand) {
  this.brand = brand;
  this.parts = ["engine", "wheels"];
}

function Car(brand, model) {
  Vehicle.call(this, brand);  // 每个 Car 实例都有独立的 parts 数组
  this.model = model;
}

Car.prototype = new Vehicle();
Car.prototype.constructor = Car;

const tesla = new Car("Tesla", "Model 3");
const bmw = new Car("BMW", "X5");

tesla.parts.push("battery");
console.log(tesla.parts);  // ["engine", "wheels", "battery"]
console.log(bmw.parts);    // ["engine", "wheels"] —— 互不影响
```

借用构造函数解决了引用属性共享的问题，但仍然需要调用两次父构造函数（一次在原型链挂载时，一次在子构造函数中），且父类型原型上的方法也被创建了两次。

### 组合继承与寄生组合继承

组合继承结合了原型链继承和借用构造函数，是 ES5 下最常用的模式，但存在父构造函数被调用两次的冗余。

寄生组合继承通过 `Object.create` 避免多余的父构造函数调用，被认为是 ES5 下最优的继承方案：

```javascript
function Vehicle(brand) {
  this.brand = brand;
}

Vehicle.prototype.start = function () {
  return `${this.brand} 启动`;
};

function Car(brand, model) {
  Vehicle.call(this, brand);
  this.model = model;
}

// 关键：用 Object.create 创建原型副本，不再调用 new Vehicle()
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// 现在可以在 Car.prototype 上添加自己的方法
Car.prototype.drive = function () {
  return `${this.model} 行驶中`;
};

const car = new Car("Honda", "Civic");
console.log(car.start());  // "Honda 启动" —— 沿原型链找到 Vehicle.prototype.start
console.log(car.drive());  // "Civic 行驶中"
console.log(car instanceof Vehicle);  // true
```

### ES6 class 继承

ES6 的 `class` 和 `extends` 本质上是寄生组合继承的语法糖，但语义更清晰，且内置了 `super` 来规范父类构造函数的调用时机：

```javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    return `${this.brand} 启动`;
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand);          // 必须先调用 super()，才能访问 this
    this.model = model;
  }

  start() {
    return `${super.start()} —— ${this.model}`;  // 通过 super 调用父类方法
  }
}

const car = new Car("Toyota", "Camry");
console.log(car.start());  // "Toyota 启动 —— Camry"
```

`class` 与 ES5 原型继承的核心区别在于：`class` 声明不存在变量提升；内部方法默认不可枚举；且子类必须在 `constructor` 中先调用 `super()` 才能使用 `this`，这一约束在 ES5 的手动继承中是不强制执行的。
