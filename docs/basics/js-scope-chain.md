# JavaScript 作用域链

### 作用域链的查找机制

作用域链是 JavaScript 解析变量时的查找路径。每个执行上下文都持有一个对外部作用域的引用，当访问一个变量时，引擎从当前作用域开始逐级向外查找，直到找到该变量或抵达全局作用域（严格模式下报 `ReferenceError`）。

```javascript
const appName = "MyApp";          // 全局作用域

function init() {
  const config = { debug: true }; // init 函数作用域

  function loadData() {
    const endpoint = "/api/data"; // loadData 函数作用域
    console.log(endpoint);        // 在当前作用域找到
    console.log(config.debug);    // 在 init 作用域找到
    console.log(appName);         // 在全局作用域找到
  }

  loadData();
}

init();
```

查找方向是单向的：内层可以访问外层的变量，外层不能访问内层的变量。每一次函数调用都会创建新的执行上下文，形成独立的作用域链。

### 作用域链的延长

当内部函数引用了外部作用域的变量时，即使外部函数已经执行完毕，被引用的变量也不会被垃圾回收。这种"外部作用域因内部引用而存活"的现象就是作用域链的延长。

```javascript
function createAPI(config) {
  const baseURL = config.baseURL;
  const timeout = config.timeout;

  return function request(path) {
    // baseURL 和 timeout 被内部函数引用
    // createAPI 执行完毕后，这些变量仍然存活
    return fetch(`${baseURL}${path}`, { timeout });
  };
}

const apiClient = createAPI({ baseURL: "https://api.site.com", timeout: 5000 });
// createAPI 已执行完毕，但 baseURL 和 timeout 仍可通过 apiClient 访问
```

这种延长也是闭包的基础——外部函数的作用域因为内部函数的引用而无法被回收，直到所有引用该作用域的内部函数都不再可达。

### var、let、const 对作用域链的影响

`var` 声明的变量属于函数作用域，不受 `{}` 块限制；`let` 和 `const` 属于块级作用域。这种差异直接影响变量在作用域链中的可见范围。

```javascript
function processItems(items) {
  for (var i = 0; i < items.length; i++) {
    // i 在整个 processItems 函数作用域内可见
  }
  console.log(i);  // items.length —— var 的 i "泄漏"到了循环外

  for (let j = 0; j < items.length; j++) {
    // j 仅在 for 循环块内可见
  }
  // console.log(j);  // ReferenceError —— j 不在当前作用域链上
}
```

块级作用域让变量的可见范围更精确，减少了作用域链中意外查找到同名变量的风险。在实际开发中，`const` 和 `let` 配合块级作用域能够更可靠地控制变量的生命周期。
