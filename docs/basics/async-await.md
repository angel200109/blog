# async/await 到底做了什么

### 本质：Promise 的语法糖

`async` 和 `await` 是对 Promise `.then()` 链式调用的封装，让异步代码的书写方式和阅读方式都更接近同步代码。一个 `async` 函数始终返回 Promise，`await` 会等待右侧的 Promise 完成并直接拿到 resolve 的值。

```javascript
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: '彤彤' });
    }, 500);
  });
}

function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 101, title: 'Promise 入门指南' }]);
    }, 500);
  });
}

function getComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['写得不错', '很有帮助']);
    }, 500);
  });
}
```

用 Promise 链式调用时，代码结构是 `.then()` 串联：

```javascript
getUser()
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((err) => console.error('出错了', err));
```

换成 `async/await` 之后：

```javascript
async function loadPageData() {
  try {
    const user = await getUser();
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error('出错了', err);
  }
}

loadPageData();
```

两段代码的运行时行为完全一致，但 `async/await` 版本的执行流程是一行接一行往下读的，不需要追踪 `.then()` 的链路。

### 如何处理结果和错误

使用 `await` 获取结果时直接拿到 resolve 的值，不需要在 `.then()` 的回调中处理：

```javascript
async function run() {
  const user = await getUser(); // user 就是 resolve 的值
  console.log(user);
}
```

错误处理使用 `try...catch`，而不是 `.catch()`：

```javascript
function processOrder(orderId) {
  return new Promise((resolve, reject) => {
    if (orderId > 0) {
      resolve({ status: 'confirmed' });
    } else {
      reject('订单 ID 无效');
    }
  });
}

async function handleOrder() {
  try {
    const result = await processOrder(101);
    console.log('成功：', result); // 成功：{ status: 'confirmed' }
  } catch (err) {
    console.log('失败：', err);
  }
}

async function handleBadOrder() {
  try {
    const result = await processOrder(-1);
    console.log('成功：', result);
  } catch (err) {
    console.log('失败：', err); // 失败：订单 ID 无效
  }
}
```

### 三种方案的对比

回顾从原始回调到 async/await 的演进：

| 方案 | 错误处理 | 可读性 | 适用场景 |
|------|---------|--------|---------|
| 嵌套回调 | 每层单独处理 | 嵌套深，追踪困难 | 历史代码维护 |
| Promise + then | `.catch()` 统一捕获 | 链式调用，相对扁平 | 需要 `.then()` 灵活组合 |
| async/await | `try...catch` 统一捕获 | 像同步代码，直观 | 流程明确、步骤顺序执行的场景 |

在需要精细控制并发（比如 `Promise.all`、`Promise.race` 组合多个异步操作）时，`.then()` 的组合方式更有表达力。在纯粹的顺序执行场景中，`async/await` 的写法更简洁。
