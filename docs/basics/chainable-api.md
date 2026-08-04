# 链式调用：为什么能 .then().then().then()


实现链式调用只需要做一件事：**在每个方法末尾返回对象自身**。这样上一个方法的返回值就是对象本身，可以直接继续调下一个方法。

```javascript
class Calculator {
  constructor(num) {
    this.value = num;
  }

  add(num) {
    this.value += num;
    return this;   // 关键：返回自身
  }

  subtract(num) {
    this.value -= num;
    return this;
  }

  multiply(num) {
    this.value *= num;
    return this;
  }

  getValue() {
    return this.value;
  }
}

const result = new Calculator(10)
  .add(5)       // 15
  .subtract(2)  // 13
  .multiply(3)  // 39
  .divide(4)    // 9.75
  .getValue();  // 9.75
```

### 和 Promise 链式调用的区别

Promise 的 `.then()` 也支持链式调用，但原理不太一样——`.then()` 返回的是**新的 Promise 对象**，而不是原来的那个：

```javascript
const p1 = Promise.resolve(1);
const p2 = p1.then(v => v + 1);
console.log(p1 === p2); // false
```

这也是为什么 Promise 链上的错误能一路冒泡被 `.catch()` 抓住——每个 `.then()` 都是独立的 Promise，有自己的状态。

