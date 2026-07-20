# 原型链上的方法优先级

## 简介

同一个方法名可能出现在实例自身、prototype、静态方法三个地方。调用时到底走哪一个？这个"就近原则"理解清楚了，才不会在调试原型链问题时一头雾水。

## 核心概念

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

## 实战场景

这个优先级规则在实际开发里最常见的应用场景是"方法覆写"：

```javascript
class Button {
  render() { return '<button>默认</button>'; }
}

class IconButton extends Button {
  render() {
    return `<button><i class="icon"></i>${super.render()}</button>`;
  }
}
```

子类的 `render` 覆盖了父类的，但可以通过 `super.render()` 调回父类的版本。

另一个常见场景是判断对象自身有没有某个属性（而不是原型上的）：

```javascript
const obj = new Foo();
obj.hasOwnProperty('a'); // true  ——自身属性
obj.hasOwnProperty('sayHello'); // false ——在原型上
// 不想遍历原型属性时：
Object.keys(obj); // 只返回自身可枚举属性
for (let key in obj) {} // 会遍历原型上的
```

## 总结

属性查找顺序：实例自身 → 构造函数 prototype → 构造函数 prototype 的 prototype → ... → null。静态方法和这个查找链无关，只能通过构造函数直接调用。
