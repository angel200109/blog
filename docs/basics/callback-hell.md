# 回调地狱是怎么来的，又怎么解决


### 先看看地狱长什么样

假设 p1、p2、p3 三个异步任务要顺序执行：

```javascript
function p1(callback) {
  setTimeout(() => {
    console.log("p1 执行完毕");
    callback();
  }, 1000);
}
function p2(callback) {
  setTimeout(() => {
    console.log("p2 执行完毕");
    callback();
  }, 1000);
}
function p3(callback) {
  setTimeout(() => {
    console.log("p3 执行完毕");
    callback();
  }, 1000);
}

// 嵌套地狱来了
p1(() => {
  p2(() => {
    p3(() => {
      console.log("全部执行完");
    });
  });
});
```

代码像圣诞树一样层层缩进，难读、难维护、难加错误处理。

### Promise 怎么解决的

把每个异步任务包装成返回 Promise 的函数，然后用 `.then()` 链式调用，扁平化了嵌套：

```javascript
function p1() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log("p1成功"); resolve("p1成功"); }, 1000);
  });
}
function p2() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log("p2成功"); resolve("p2成功"); }, 1000);
  });
}
function p3() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log("p3成功"); resolve("p3成功"); }, 1000);
  });
}

p1().then(p2).then(p3);
```

### async/await 更优雅

```javascript
async function run() {
  await p1();
  await p2();
  await p3();
}
run();
```

看起来跟同步代码一样，可读性拉满。本质还是 Promise——async 函数返回的也是 Promise。

