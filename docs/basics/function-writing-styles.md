# JavaScript 函数的几种写法

### 函数声明与函数表达式

函数声明会被提升（hoisting），可以在声明之前调用：

```javascript
function getUserName() {
  console.log('fetching user name...');
}
getUserName();
```

函数表达式将函数赋值给变量，只有变量声明被提升，赋值不会——在赋值前调用会报错：

```javascript
const getUserInfo = function () {
  console.log('fetching user info...');
};
getUserInfo();
```

函数表达式可以是匿名的，也可以具名。具名函数表达式在调试时堆栈信息更清晰，且函数内部可以通过自身名字递归调用：

```javascript
const calculate = function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};
```

### 箭头函数

箭头函数是 ES6 引入的简写形式，核心差异在于不绑定自己的 `this`、`arguments`、`super` 或 `new.target`：

```javascript
const formatPrice = (price) => {
  return '¥' + price.toFixed(2);
};
```

箭头函数适合作为回调或需要继承外层 `this` 的场景——比如在 `setTimeout` 或事件处理中访问组件实例。但不要在需要动态 `this` 的场景使用它（比如作为对象方法时访问对象其他属性）。

### 立即执行函数（IIFE）

IIFE 的核心价值是创建独立作用域，避免变量污染：

```javascript
(function () {
  const moduleState = { loaded: false };
  console.log('module initialized');
})();

(() => {
  console.log('arrow IIFE');
})();
```

在 ES6 模块化普及之前，IIFE 是实现模块隔离的常用手段。现在大多数场景已被 `import`/`export` 替代，但在某些需要立即执行且不暴露内部状态的初始化代码中仍然适用。

### 对象方法的几种写法

```javascript
const orderService = {
  // 方法简写（ES6，推荐）
  createOrder() {
    console.log('Order created');
  },

  // 传统 function 表达式
  cancelOrder: function () {
    console.log('Order cancelled');
  },

  // 箭头函数——this 指向外层，不指向 orderService
  queryOrder: () => {
    console.log('Querying order');
  }
};
```

方法简写是对象中定义函数的推荐方式，语法简洁且语义明确。箭头函数作为对象方法时要特别注意：它的 `this` 不会指向对象本身，而是捕获定义时的外层 `this`。

### class 中的方法

```javascript
class OrderManager {
  constructor(orderId) {
    this.orderId = orderId;
    // 构造函数中的实例方法
    this.printId = function () {
      console.log('Order ID:', this.orderId);
    };
  }

  // 原型方法，实例共享
  ship() {
    console.log('Shipping order', this.orderId);
  }

  // 静态方法
  static validate(orderData) {
    return orderData.items && orderData.items.length > 0;
  }
}

// 继承
class ExpressOrder extends OrderManager {
  constructor(orderId, trackingNumber) {
    super(orderId);
    this.trackingNumber = trackingNumber;
  }

  ship() {
    super.ship();
    console.log('Tracking:', this.trackingNumber);
  }
}
```

`constructor` 中定义的实例方法每个实例各自持有一份（不共享内存），原型方法所有实例共享一份，静态方法挂在类本身上与实例无关。面向具体实例数据的逻辑放原型方法，工具型的通用逻辑放静态方法。
