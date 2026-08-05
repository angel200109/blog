# JavaScript 闭包

### 闭包的定义

闭包是函数与其创建时所在词法作用域的组合。当一个函数能够访问它定义时所在的外部作用域中的变量，且该函数在其外部作用域之外被调用时，就形成了闭包。

```javascript
function createCounter(initial) {
  let count = initial;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter(0);
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
```

`createCounter` 执行完毕后，其作用域本应销毁。但由于返回的对象中的方法仍然持有对 `count` 的引用，该作用域被保留——`count` 成为一个只能通过 `counter` 对象暴露的方法访问的私有变量。

### 闭包的作用

**数据封装与私有化。** 闭包是 JavaScript 实现私有变量的核心手段之一，在模块模式中广泛使用：

```javascript
function createUserStore() {
  const users = [];

  return {
    addUser(name) {
      users.push({ name, createdAt: Date.now() });
    },
    getUserCount() {
      return users.length;
    },
    listUsers() {
      return [...users];  // 返回浅拷贝，保护内部数组
    }
  };
}

const store = createUserStore();
store.addUser("Alice");
store.addUser("Bob");
console.log(store.getUserCount());  // 2
// store.users → undefined —— 外部无法直接访问
```

**回调与异步操作中的状态保持。** 闭包在定时器、事件监听和网络请求回调中保持上下文状态：

```javascript
function fetchWithRetry(url, maxRetries) {
  let retries = 0;

  return function execute() {
    return fetch(url).catch(() => {
      retries++;
      if (retries <= maxRetries) {
        console.log(`重试第 ${retries} 次`);
        return execute();
      }
      throw new Error(`请求失败，已重试 ${maxRetries} 次`);
    });
  };
}

const resilientFetch = fetchWithRetry("/api/data", 3);
```

### 闭包与内存管理

闭包延长了变量的生命周期，这也意味着如果不加控制，可能导致内存泄漏。尤其是在 DOM 操作中，闭包引用了已移除的 DOM 元素会导致该元素无法被 GC 回收：

```javascript
function bindHandler() {
  const largeData = new Array(100000).fill("data");

  document.getElementById("btn").addEventListener("click", () => {
    console.log(largeData.length);  // largeData 一直被闭包引用
  });
}

// 即使不再需要 largeData，它仍然无法被回收
// 解决方案：在不需要时显式移除事件监听或置空引用
```

在不需要闭包持有的资源时，主动将引用置为 `null` 或移除事件监听器是避免内存堆积的有效方式。闭包是有力工具，但使用时应明确其持有引用的范围与生命周期。
