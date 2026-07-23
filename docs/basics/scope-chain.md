# 作用域链：变量查找机制

## 简介

你在函数里用了一个变量，JS 引擎怎么知道它指的是哪个？它不会乱猜，而是沿着一条链往上找——这就是作用域链。理解它，闭包和内存泄漏也就不难懂了。

## 核心概念

### 作用域链的结构

每个执行上下文都有一个指向外部作用域的引用，形成一条链：**当前作用域 → 外层作用域 → ... → 全局作用域**。

```js
const global = 'global';

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';
    console.log(innerVar); // 当前作用域找到
    console.log(outerVar); // 向上找到 outer
    console.log(global);   // 再向上找到全局
  }

  inner();
}
```

查找 `outerVar` 时，先在 `inner` 里找，没找到就顺着链去 `outer` 里找，再没有就去全局。一直到全局都找不到，就返回 `undefined`（非严格模式下给全局对象挂属性是另一回事）。

### 作用域链怎么"延长"了

所谓作用域链延长，指的是**外层作用域被内部函数引用，导致外层变量无法被垃圾回收**。

```js
function createCounter() {
  let count = 0;          // 正常情况下函数执行完就该销毁
  return function () {
    return ++count;       // 但内部函数引用了 count
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// count 还活着，因为 counter 这个函数还持有对它的引用
```

这其实也是闭包的原理——内部函数保留对外部变量的引用，外部函数即使执行完毕，那些变量也不会被回收。

## 实战场景

写 React 的 `useCallback` 或 Vue 的 `watch` 时，如果回调里引用了组件内的变量，这些变量就不会被释放。当你发现某个页面内存一直涨，大概率是某处作用域链被"意外延长"了——检查一下定时器、事件监听、闭包引用。

## 总结

作用域链是 JS 查找变量的路径：就近原则，一路向上，找不到拉倒。它也是闭包和内存泄漏的底层机制。
