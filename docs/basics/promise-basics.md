# Promise 解决了什么问题

### Promise 是什么

Promise 是 JavaScript 中表示异步操作最终完成（或失败）及其结果值的对象。它有三种状态：

- **Pending（进行中）**：异步操作尚未完成
- **Fulfilled（已完成）**：操作成功，得到了结果
- **Rejected（已拒绝）**：操作失败，得到了失败原因

状态一旦从 Pending 变为 Fulfilled 或 Rejected 就不可逆转——这个特性保证了异步结果的一致性，不会出现"先成功后又失败"的混乱。

创建一个返回 Promise 的函数，就是把异步操作放入 `new Promise` 的执行器函数中：

```javascript
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = { id: userId, name: '彤彤' };
      resolve(user); // 操作成功，传递结果
      // 如果失败则调用 reject(new Error('...'))
    }, 1000);
  });
}
```

Promise 对象有两个核心内部属性：状态（state）和值（value）。resolve 被调用时状态变为 Fulfilled 且 value 为传入的值；reject 被调用时状态变为 Rejected 且 value 为传入的错误。

### 为什么 Promise 能解决回调地狱

回调地狱的痛点在于：多个异步任务需要顺序执行时，回调层层嵌套导致代码可读性差且错误处理分散。

Promise 的解决方案是把嵌套变为链式调用——每个 `.then()` 返回新的 Promise，让异步流程变成一条"流水线"：

```javascript
function p1() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log('p1 完成'); resolve(); }, 1000);
  });
}
function p2() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log('p2 完成'); resolve(); }, 1000);
  });
}
function p3() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log('p3 完成'); resolve(); }, 1000);
  });
}

p1().then(p2).then(p3);
// 等价于 p1().then(() => p2()).then(() => p3());
```

对比回调写法，链式调用不再有层层缩进，执行顺序一目了然。

### 实例方法：then、catch、finally

**then** 接收两个可选回调——成功回调（onFulfilled）和失败回调（onRejected），返回新的 Promise，这是链式调用的基础。

```javascript
fetchUserData(1).then(
  (user) => { console.log('用户数据：', user); },
  (error) => { console.log('获取失败：', error); }
);
```

**catch** 是 `.then(null, onRejected)` 的语法糖，专门处理 Promise 链中任意环节抛出的错误：

```javascript
fetchUserData(1)
  .then((user) => {
    console.log('用户数据：', user);
  })
  .catch((error) => {
    console.log('某个环节出错了：', error);
  });
```

**finally** 无论 Promise 成功还是失败都会执行，适合清理操作——关闭加载动画、释放资源等：

```javascript
showLoading();
fetchUserData(1)
  .then((user) => renderUser(user))
  .catch((error) => showError(error))
  .finally(() => hideLoading());
```

### 处理异步结果

Promise + then 获取结果时，在成功回调中处理 resolve 传出的值，在失败回调（或 catch）中处理 reject 传出的错误：

```javascript
function processOrder(orderId) {
  return new Promise((resolve, reject) => {
    if (orderId > 0) {
      resolve({ status: 'confirmed', id: orderId });
    } else {
      reject('订单 ID 无效');
    }
  });
}

processOrder(101)
  .then((result) => console.log('订单确认：', result))
  .catch((error) => console.log('处理失败：', error));

processOrder(-1)
  .then((result) => console.log('订单确认：', result))
  .catch((error) => console.log('处理失败：', error)); // 捕获 reject
```
