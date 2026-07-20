# 回调地狱是怎么来的，又怎么解决

## 简介

刚学 JS 异步的时候，最烦的就是一层层嵌套的回调。这个问题的本质是：多个异步任务需要按顺序执行，而且后一个依赖前一个的结果。原生回调写法会把你逼进"回调地狱"。

## 核心概念

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

## 实战场景

真实业务里最常见的是"先拿用户信息 → 再根据用户 ID 拿文章列表 → 再拿评论"这种串行依赖：

```javascript
async function loadPage() {
  try {
    const user = await getUser();
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error("出错了", err);
  }
}
```

对比 `.then()` 链式写法，async/await 至少少三层缩进，而且错误处理用 try/catch 比 `.catch()` 直观得多。

## 总结

Promise + async/await > Promise + then > 嵌套回调。async/await 不是银弹，但写串行异步逻辑的时候它就是最好用的方案。
