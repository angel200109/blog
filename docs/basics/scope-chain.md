# 作用域链：变量查找机制


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

