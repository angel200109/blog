# 静态方法和实例方法的区别

### 概念区分

在 JavaScript 中，挂载位置决定了方法的调用方式和适用场景。

**静态方法**定义在构造函数（类）本身上，通过 `ClassName.methodName()` 调用，实例无法直接访问。静态方法适合工具函数或不依赖实例状态的操作——比如 `Array.isArray()`、`Object.keys()` 都是典型的静态方法。

**实例方法**定义在 `prototype` 上（或 class 内部直接声明的方法），通过 `instance.methodName()` 调用。实例方法需要访问实例数据，比如 `arr.push()`、`str.toUpperCase()`。

一个直观的判断标准：如果方法逻辑和具体实例的数据相关，定义为实例方法；如果方法是一个通用的工具逻辑，和实例状态无关，定义为静态方法。

### 两种写法

ES5 时代通过构造函数和 prototype 分别挂载：

```javascript
function Animal(name) {
  this.name = name;
  // 实例方法——每个实例各自持有一份，不共享内存
  this.sayHello = function () {
    console.log('Hi, I am ' + this.name);
  };
}

// 原型方法——所有实例共享同一份
Animal.prototype.speak = function () {
  console.log(this.name + ' makes a sound.');
};

// 静态方法——只能通过类名调用
Animal.describe = function () {
  console.log('Animals are living beings.');
};
```

ES6 class 语法让这种区分更清晰：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.sayHello = function () {
      console.log('Hi, I am ' + this.name);
    };
  }

  // 原型方法
  speak() {
    console.log(this.name + ' makes a sound.');
  }

  // 静态方法
  static describe() {
    console.log('Animals are living beings.');
  }
}
```

### 继承时的行为

子类通过 `extends` 继承父类时，实例方法和原型方法会被子类实例继承，静态方法也会被子类继承：

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    super.speak();
    console.log(this.name + ' barks.');
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak();    // 原型方法，通过 super 调用父类实现
Dog.describe(); // 静态方法也会被子类继承
```

### 内存模型

实例方法（在 constructor 中通过 `this.xxx = function` 定义）每个实例都持有一份独立拷贝，不同实例之间不共享。原型方法只存在于 `prototype` 对象上的一份，所有实例通过原型链引用同一份。对于不需要绑定实例私有状态的方法，放在 prototype 上可以显著节省内存——当实例数量较大时这个差异会很可观。
