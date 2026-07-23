# 闭包是什么，有什么用

## 简介

闭包是 JavaScript 里绕不开的概念。简单说：一个函数能记住并访问它被创建时所在的作用域里的变量，即使那个作用域已经"结束"了。面试必问，实际开发也天天用。

## 核心概念

### 闭包长什么样

```js
function makeGreeting(name) {
  const greeting = '你好，';

  return function () {
    console.log(greeting + name);
  };
}

const sayHi = makeGreeting('小明');
sayHi(); // "你好，小明"
```

`makeGreeting` 执行完了，按理说 `name` 和 `greeting` 该被回收。但返回的函数还"记得"它们——这就是闭包。

### 闭包和内存泄漏的关系

闭包本身不是内存泄漏，但闭包持有的变量不会被 GC 回收。如果你在全局挂了一堆闭包又不清理，内存就会持续上涨。

```js
// 反面案例：事件监听里用了闭包，但忘了移除
function bindHandler(el) {
  const hugeData = new Array(100000).fill('x'); // 大对象
  el.addEventListener('click', () => {
    console.log(hugeData.length);
  });
  // 监听器不 remove，hugeData 永远不释放
}
```

### 闭包的经典用途

**数据私有化**——模拟私有变量：

```js
function createWallet(initial) {
  let balance = initial;
  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) { balance -= amount; },
    getBalance() { return balance; }
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
console.log(wallet.getBalance()); // 150
// balance 不能直接被外部修改
```

## 实战场景

防抖和节流的实现就是闭包的典型应用——内部 timer 变量被返回的函数持续引用。React 的 `useState`、Vue 的 `computed` 底层也都依赖闭包来保持状态。

## 总结

闭包 = 函数 + 它能访问的外部变量。用得对，它是封装利器；用得不对，它是内存泄漏的来源。关键是管理好生命周期，该清理的时候别忘记。
