# Promise 和 async/await 到底是什么关系

### async 函数的返回值始终是 Promise

`async` 函数的返回值会自动包装成 Promise 对象。即使函数体内 return 的是普通值，调用方拿到的也是一个 Fulfilled 状态的 Promise：

```javascript
async function fetchConfig() {
  return { env: 'production', debug: false };
}

console.log(fetchConfig() instanceof Promise); // true

fetchConfig().then((config) => {
  console.log(config); // { env: 'production', debug: false }
});
```

### async 函数内部的阻塞行为

`await` 会暂停当前 `async` 函数的执行，等待右侧 Promise 完成。关键点在于：**暂停的只是当前 async 函数，不会阻塞函数外部的代码**。

```javascript
function delayTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('setTimeout log...');
      resolve();
    }, 3000);
  });
}

async function runTask() {
  await delayTask();
}

console.log(runTask() instanceof Promise); // true——调用即返回 Promise
console.log('1'); // 不会被阻塞，立即输出
// 3 秒后输出 'setTimeout log...'
// 输出顺序：true → 1 → setTimeout log...
```

`runTask()` 被调用后立即返回一个 Promise，外部代码继续执行。函数内部 `await` 之后的代码会被放入微任务队列，等 Promise 完成后再执行。

### await 后的代码是微任务

看一个关键例子：

```javascript
async function runSequence() {
  console.log('A');
  await Promise.resolve();
  console.log('B'); // 微任务
}

runSequence();
console.log('C');

for (let i = 0; i < 1000000; i++) {
  // 同步代码，阻塞主线程
}
console.log('同步循环结束');
```

输出顺序是 `A` → `C` → `同步循环结束` → `B`。`await` 之后的 `console.log('B')` 虽然在 async 函数内部，但它作为微任务要等同步代码全部执行完才会执行。这和 Promise `.then()` 的回调行为完全一致——`await` 本质就是把其后的代码包在 `.then()` 里。

### 总结

`async/await` 和 Promise 的关系可以归结为：

1. `async` 函数返回 Promise，调用方可以 `.then()` 或 `await` 消费
2. `await` 等价于 `.then()`——等待 Promise 完成并拿到结果值
3. `await` 后的代码等价于 `.then()` 回调——作为微任务执行
4. 错误处理用 `try...catch` 等价于 `.catch()`

理解这个关系之后，就不会把 `async/await` 当成什么全新的机制——它只是让 Promise 更好读、更好写的语法糖。
