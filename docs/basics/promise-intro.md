# Promise 是什么，怎么用

## 简介

Promise 是 JS 处理异步操作的核心机制。它把"将来某个时刻会完成（或失败）的操作"抽象成一个对象，让你不用再嵌套回调。

## 核心概念

### 三种状态

Promise 有三种状态：

- **Pending**（进行中）：初始状态，还没出结果
- **Fulfilled**（已完成）：操作成功
- **Rejected**（已拒绝）：操作失败

状态一旦从 pending 变成 fulfilled 或 rejected，就定死了，不会再变。

### 怎么创建一个 Promise

把一个异步操作放到 `new Promise()` 的执行器函数里：

```javascript
function doubleData(data) {
  return new Promise((resolve, reject) => {
    if (data > 0) {
      resolve("成功" + data * 2);
    } else {
      reject("失败");
    }
  });
}
```

`resolve()` 和 `reject()` 分别对应成功和失败两种结果。

### 怎么消费 Promise

```javascript
doubleData(5)
  .then(result => console.log(result))  // "成功10"
  .catch(error => console.log(error));  // 不触发

doubleData(-2)
  .then(result => console.log(result))  // 不触发
  .catch(error => console.log(error));  // "失败"
```

- `.then()` 接收两个回调：成功回调、失败回调。只传一个就只处理成功，失败冒泡到 `.catch()`
- `.catch()` 本质上是 `.then(null, onRejected)` 的语法糖
- `.finally()` 不管成功失败都会执行，适合做清理工作

## 实战场景

实际开发里很少手动 new Promise——大多数异步 API 已经返回 Promise 了（fetch、axios 等）。但你很可能会写这样的工具函数：

```javascript
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}
```

## 总结

Promise 的核心就三件事：状态管理（pending → fulfilled/rejected）、链式调用（.then/.catch）、错误冒泡。理解了这三样，后面 async/await 就好懂了。
