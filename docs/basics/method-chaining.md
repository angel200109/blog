# 链式调用的实现方式

### 原理：返回 this

链式调用不是 JavaScript 的特性，而是一种设计模式——每个方法执行完后返回对象自身（`this`），下一个方法就能继续在同一个对象上调用。

一个简单的实现：

```javascript
class Calculator {
  constructor(value) {
    this.value = value;
  }

  add(num) {
    this.value += num;
    return this;
  }

  subtract(num) {
    this.value -= num;
    return this;
  }

  multiply(num) {
    this.value *= num;
    return this;
  }

  divide(num) {
    this.value /= num;
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
  .getValue();

console.log(result); // 9.75
```

每个运算方法修改内部状态后返回 `this`，下一次调用自然能找到同一个对象的当前状态。`getValue()` 是例外——它返回计算结果而不是 `this`，标志着链式调用的结束。

### 与 Promise 链式调用的区别

Promise 的 `.then()` 也支持链式调用，但它的"返回 this"逻辑不同：`.then()` 每次都返回一个**新的 Promise**，而不是原 Promise 自身。这种不可变性避免了状态污染——每个 `.then()` 拿到的是上一个 `.then()` 返回的新值，不会互相干扰。

```javascript
fetch('/api/user/1')
  .then((res) => res.json())
  .then((user) => fetch(`/api/order/${user.id}`))
  .then((res) => res.json())
  .then((orders) => console.log(orders));
```

每一步都返回新的 Promise，链上每个环节相对独立。这与 Calculator 示例中"同一个对象不断被修改"的方式不同——Calculator 是**有状态可变对象**的链，Promise 是**不可变数据流**的链。

### 实际开发中的应用

jQuery 是链式调用的经典使用者：

```javascript
$('#userCard')
  .addClass('active')
  .css('background', '#f5f5f5')
  .fadeIn(300);
```

现代前端中，数组方法的链式组合也很常见：

```javascript
const activeOrderIds = orderList
  .filter((order) => order.status === 'active')
  .map((order) => order.id)
  .sort((a, b) => a - b);
```

`filter`、`map`、`sort` 都返回新数组，设计上遵循了不可变性——这和 Promise 链的思路一致，跟 Calculator 那种"修改自身然后返回 this"的思路不同。两种方式没有绝对的优劣：可变链适合需要逐步构建状态的场景，不可变链更适合数据处理和异步流程。

### 边界注意

返回 `this` 的链式调用暗藏一个风险：使用者可能忽略调用顺序带来的副作用。一个方法修改了内部状态，会影响后续所有方法的执行结果——这对于喜欢把链式调用的代码拆开复用的开发者来说是个陷阱。如果设计链式 API，方法名的语义需要足够清晰，让调用顺序的意图不言自明。
