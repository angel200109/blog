# 原型链中的优先级规则

### 实例属性优先于原型属性

当对象自身的属性和原型链上的属性同名时，实例自身的属性优先。JavaScript 引擎查找属性时从对象自身开始，找到就停，不会继续往上找。

看一个经典面试题：

```javascript
function Foo() {
  this.a = function () {
    console.log('2');
  };
}

Foo.prototype.a = function () {
  console.log('3');
};

Foo.a = function () {
  console.log('4');
};

const obj = new Foo();
obj.a(); // 输出 2
```

输出 `2` 而不是 `3` 或 `4`，原因在于三层定义各自的作用域：

1. `this.a` 在构造函数中定义，是实例自身的属性。`new Foo()` 创建对象时，`this.a` 被赋值为一个函数，放在实例自身上。查找 `obj.a` 时在第一层就找到了，不会继续往原型上找。

2. `Foo.prototype.a` 定义在原型上，是所有实例共享的方法。如果实例自身没有 `a` 这个属性，查找才会走到这里。

3. `Foo.a` 是构造函数本身的静态方法，挂在 `Foo` 这个函数对象上，和 `obj` 实例没有关系——`obj.a` 根本不会去找 `Foo.a`。要调用它只能通过 `Foo.a()`。

### 查找顺序的完整路径

总结一下属性查找的完整路径：

```
obj 自身属性 → obj.__proto__ (即 Foo.prototype) → Foo.prototype.__proto__ (即 Object.prototype) → null
```

每一步的顺序是固定的：自身 → 原型 → 原型的原型 → `null`。这个机制保证了：

- 实例可以"覆盖"原型上的同名方法（方法重写）
- 所有对象默认继承 `Object.prototype` 的方法（`toString`、`hasOwnProperty` 等）
- 原型链末端的 `null` 是查找的终点，避免无限循环

### 静态方法 vs 原型方法 vs 实例方法

把三种方法放在一起对比：

```javascript
function Order() {
  // 实例方法——挂在对象自身上
  this.getStatus = function () {
    return 'pending';
  };
}

// 原型方法——挂在 prototype 上，实例共享
Order.prototype.cancel = function () {
  console.log('订单已取消');
};

// 静态方法——挂在构造函数上，和实例无关
Order.findAll = function () {
  console.log('查询所有订单');
};

const order = new Order();
order.getStatus(); // 实例方法，自身属性，直接找到
order.cancel();    // 原型方法，自身找不到，沿原型链找到
Order.findAll();   // 静态方法，通过构造函数调用

// order.findAll();  // TypeError——实例上找不到静态方法
```

这三种方法的区别不仅是写法位置不同，更决定了调用方式和适用场景：实例方法放每个对象独有的逻辑；原型方法放共享的行为；静态方法放不依赖实例状态的工具函数。
