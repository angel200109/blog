# new 操作符的内在逻辑


### new 干了什么

假设执行 `new Person('小明')`，内部流程是：

1. 创建一个空对象
2. 把空对象的 `__proto__` 指向 `Person.prototype`
3. 把 `this` 绑定到这个空对象
4. 执行 `Person` 构造函数（此时 `this` 指向空对象）
5. 如果构造函数返回了对象，就返回那个对象；否则返回 this 指向的对象

### 手写实现

```js
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype) // 步骤 1+2
  const result = constructor.apply(obj, args)       // 步骤 3+4
  return result instanceof Object ? result : obj    // 步骤 5
}
```

核心就三行。`Object.create` 同时完成了创建对象和连接原型链。

### 容易被忽略的细节

当构造函数返回一个对象时，`new` 会丢弃创建的空对象：

```js
function Foo() {
  this.name = 'foo'
  return { name: 'bar' }
}
new Foo() // { name: 'bar' }，this.name 白写了
```

但如果返回的是原始值（`'hello'`、`42`），`new` 会忽略它，老老实实返回 this 指向的对象。

