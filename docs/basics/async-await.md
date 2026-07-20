# async/await：让异步代码像同步一样写

## 简介

async 和 await 是 Promise 的语法糖。它们没有创造新的能力，但让异步代码的写法从"链式调用"变成了"看着像同步，跑起来异步"。

## 核心概念

### async 函数

在函数前加 `async`，这个函数就自动返回一个 Promise：

```javascript
async function fn() {
  return "hello";
}
console.log(fn() instanceof Promise); // true
```

即使你 return 的是普通值，也会被包装成 Promise。

### await：暂停，但不阻塞

`await` 后面跟一个 Promise，它会"暂停"当前 async 函数的执行，等待 Promise resolve。但注意——它**不阻塞函数外的代码**：

```javascript
async function fn() {
  await p1(); // 暂停，等 p1 完成
  console.log("fn 继续");
}
console.log("1"); // 不等，直接输出
// 输出顺序：1 → (p1 完成后) fn 继续
```

有个重要细节：`await` 后的代码会被放进**微任务队列**：

```javascript
async function fn() {
  console.log("A");
  await Promise.resolve();
  console.log("B"); // 微任务
}
fn();
console.log("C");
// 输出：A C B
```

### 错误处理用 try/catch

```javascript
async function run() {
  try {
    const result = await someAsyncTask();
    console.log("成功：", result);
  } catch (err) {
    console.log("失败：", err);
  }
}
```

对比 Promise 链式的 `.then().catch()`，try/catch 更直观——尤其是多个 await 的时候不用写一串 `.catch()`。

## 实战场景

真实项目中 async/await 最常见的两个坑：

1. **别把 forEach 和 async 混用**——forEach 不会等 await：

```javascript
// ❌ 不会按顺序等
[1,2,3].forEach(async (id) => {
  await fetchUser(id);
});

// ✅ 用 for...of
for (const id of [1,2,3]) {
  await fetchUser(id);
}
```

2. **并发请求不要串行写**——没有依赖关系的请求并行发：

```javascript
// ❌ 串行，慢
const user = await fetchUser();
const posts = await fetchPosts();

// ✅ 并行，快
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
```

## 总结

async/await 本质是 Promise + Generator 的语法糖。核心价值是把异步代码写成同步风格，降低心智负担。什么时候用 await 什么时候用 Promise.all，取决于任务之间有没有依赖。
