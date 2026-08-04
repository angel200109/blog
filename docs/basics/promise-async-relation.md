# Promise 和 async/await 到底是什么关系


### async 函数返回 Promise

```javascript
async function fn(params) {
  await p1();
}
console.log(fn() instanceof Promise); // true，调用的瞬间就返回了一个 Promise
```

`fn()` 一被调用就返回 Promise，函数体内部的 await 是这个 Promise 内部的逻辑，不影响外部的执行流。

```javascript
async function fn() {
  await p1();
}
console.log(fn() instanceof Promise); // true
console.log("1"); // 不阻塞，照常输出

function p1() {
  return new Promise((resolve) => {
    setTimeout(() => { console.log("setTimeout log..."); resolve(); }, 3000);
  });
}
// 输出顺序：1 → (3秒后) setTimeout log...
```

### await 后面的代码是微任务

这一点经常被忽略——`await` 后面的代码会被放进微任务队列：

```javascript
async function fn() {
  console.log("A");
  await Promise.resolve();
  console.log("B"); // 微任务！
}
fn();

console.log("C");
for (let i = 0; i < 1000000; i++) {
  // 同步代码，即使循环100万次
}
// 输出：A C B
```

`await` 之后的部分，要等所有同步代码执行完、宏任务清空后才会执行。

### 为什么说 async/await 更优雅

对比一下两种写法：

```javascript
// Promise 链式
getUser()
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error("出错了", err));

// async/await
async function run() {
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

async/await 的方案里，变量作用域更直观——`user` 和 `posts` 可以在后续代码中直接使用，不需要通过 `.then()` 的参数传递。

