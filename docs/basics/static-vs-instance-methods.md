# 静态方法和实例方法，到底差在哪


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

