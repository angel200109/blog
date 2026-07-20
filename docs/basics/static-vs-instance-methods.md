# 静态方法和实例方法，到底差在哪

## 简介

写 JS 类的时候，有些方法挂在类本身上，有些挂在 `prototype` 上——这两种方法的区别不只是写法不同，背后涉及内存分配和调用方式的根本差异。搞清楚这个，写出来的类才会干净利落。

## 核心概念

### 实例方法：每个实例独立 or 共享？

实例方法有两种放法：

**放在构造函数里**——每个实例都有一份独立拷贝，互不影响，但占内存：

```javascript
function Animal(name) {
  this.name = name;
  this.sayHello = function () {
    console.log("Hi, I'm " + this.name);
  };
}
```

**放在 prototype 上**——所有实例共享同一个方法引用，省内存：

```javascript
Animal.prototype.speak = function () {
  console.log(this.name + ' makes a sound.');
};
```

用 class 语法写也一样：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.sayHello = function () { console.log("Hi, I'm " + this.name); }; // 实例独立
  }
  speak() { console.log(this.name + ' makes a sound.'); } // 原型共享
}
```

### 静态方法：跟实例没关系

静态方法直接挂在构造函数/类本身上，只能通过类名调用，实例没法用：

```javascript
class Animal {
  static describe() {
    console.log('Animals are living beings.');
  }
}

Animal.describe(); // 正常
const dog = new Animal('dog');
dog.describe();    // TypeError: dog.describe is not a function
```

## 实战场景

实际开发中，静态方法适合放工具函数——比如工厂方法、参数校验、单例控制：

```javascript
class User {
  static create(name) {
    if (!name) throw new Error('name required');
    return new User(name);
  }
  constructor(name) { this.name = name; }
}
```

实例方法如果跟具体实例数据无关、可以共享的，就放 prototype 上。需要闭包私有变量的方法才放构造函数里。

## 总结

一句话：静态方法用类名调，实例方法用实例调。prototype 方法共享省内存，构造函数内方法独立但冗余。
