# 原型链上的方法优先级


### 优先级：自身方法 > 原型方法 > 更上层原型

来看这个经典面试题：

```javascript
let Foo = function () {
  this.a = function () {
    console.log("2");
  };
};

Foo.prototype.a = function () {
  console.log("3");
};

Foo.a = function () {
  console.log("4");
};

let obj = new Foo();
obj.a(); // 输出什么？
```

答案是 **2**。拆解一下：

1. 构造函数里 `this.a` 给每个实例添加了**自身的方法 a**——这是实例自己的属性
2. `Foo.prototype.a` 定义在原型上，是共享方法
3. `Foo.a` 是构造函数本身的**静态方法**，跟实例完全没关系

调用 `obj.a()` 时，JS 先在 `obj` 自身找，发现有 `a`，直接用，不会再去原型上找了。

### 静态方法怎么调

```javascript
Foo.a(); // "4"  ——直接通过构造函数调用
obj.a(); // "2"  ——实例调用的是自身方法
```

静态方法只能通过类名/构造函数名调用，实例访问不到。

