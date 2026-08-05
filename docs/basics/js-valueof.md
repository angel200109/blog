# JS valueOf 方法

### valueOf 是什么

`valueOf` 是 `Object.prototype` 上的方法，所有对象默认继承它。它的职责是将对象转换为其原始值（primitive value）。JavaScript 在需要将对象当作原始值使用时，会自动调用该方法。

默认的 `Object.prototype.valueOf` 返回对象自身，因此对于普通对象而言价值有限。但内置类型如 `Date`、`Number`、`String`、`Boolean` 都重写了 `valueOf`，使其返回有意义的原始值：

```javascript
const now = new Date();
now.valueOf();          // 1712851200000（时间戳）

const wrapped = new Number(42);
wrapped.valueOf();      // 42

const flag = new Boolean(true);
flag.valueOf();         // true
```

### valueOf 在宽松相等比较中的作用

`==` 在比较对象和原始类型时，会尝试调用对象的 `valueOf` 或 `toString` 将对象转为原始值。这是理解 `==` 隐式转换的关键一环：

```javascript
const counter = {
  value: 3,
  valueOf() {
    return this.value;
  }
};

counter == 3;   // true —— 调用 valueOf() 得到 3
counter > 2;    // true —— 比较时同样触发 valueOf
```

如果对象没有自定义 `valueOf`，`==` 会回退到 `toString`：

```javascript
const emptyArray = [];
emptyArray == 0;     // true —— [] → toString() → "" → Number("") → 0
emptyArray == "";    // true —— [] → toString() → ""
```

### 触发 valueOf 的常见场景

除了 `==` 比较，以下操作也会隐式调用 `valueOf`：

- **算术运算**：`+`、`-`、`*`、`/` 操作符在遇到对象操作数时，会先尝试 `valueOf`，失败再尝试 `toString`
- **关系比较**：`>`、`<`、`>=`、`<=` 同样触发 `valueOf`
- **`Date` 的时间运算**：两个 `Date` 实例相减时，`valueOf` 返回时间戳，得到毫秒差值

```javascript
const startTime = new Date("2026-01-01");
const endTime = new Date("2026-01-02");

const durationMs = endTime - startTime;  // 86400000，两个 Date 相减调用 valueOf
```

### 实例方法与原型方法的区别

一个容易混淆的点是：定义在构造函数 `prototype` 上的方法与定义在实例自身的方法调用的 `valueOf` 行为一致——它们都从 `Object.prototype` 沿原型链继承 `valueOf`。区别在于实例方法是每个对象独立持有的函数引用（占用独立内存），而原型方法被所有实例共享。

```javascript
function Task(title) {
  this.title = title;
  // 实例方法：每个 new Task() 都创建一份
  this.describe = function () {
    return `Task: ${this.title}`;
  };
}

// 原型方法：所有实例共享同一份
Task.prototype.getTitle = function () {
  return this.title;
};

const taskA = new Task("Review PR");
const taskB = new Task("Write tests");

taskA.describe === taskB.describe;   // false —— 两份独立函数
taskA.getTitle === taskB.getTitle;   // true —— 共享同一份
```

原型方法在内存效率和动态扩展上更有优势，而实例方法适合需要访问构造函数闭包中私有变量的场景。
