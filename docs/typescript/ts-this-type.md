# TypeScript 中 this 的类型

### 为什么 this 需要类型标注

JavaScript 中 `this` 的指向由调用方式决定（谁调用指向谁），而不是由定义位置决定。这一特性在回调函数、事件处理和类方法传递时频繁引发问题——函数被传递后，它的 `this` 可能指向 `undefined`（严格模式）或全局对象。

TypeScript 通过两种机制在编译期捕获这类错误：`--noImplicitThis` 选项和显式的 `this` 参数声明。

### --noImplicitThis 编译选项

当开启 `noImplicitThis: true`（`strict: true` 已包含），TypeScript 会在无法推断 `this` 类型时直接报错：

```typescript
class Form {
  value = "";
  
  handleInput(e: Event) {
    // this 的类型被正确推断为 Form
    this.value = (e.target as HTMLInputElement).value;
  }
}

// 将 handleInput 作为回调传递
const form = new Form();
document.querySelector("input")!.addEventListener("input", form.handleInput);
// 运行时：this 不再指向 form，而是指向 input 元素
// 但编译期：如果 event listener 的类型声明正确，TS 可能不会报错
```

`noImplicitThis` 检查的是函数体内的 `this` 引用——当 `this` 的类型无法从上下文中推断出来时，编译器会给出错误提示。

### 显式 this 参数

TypeScript 允许在函数签名中声明 `this` 作为第一个参数（这是一个假参数，编译后会被移除，仅在类型检查阶段生效）：

```typescript
interface CardProps {
  title: string;
  content: string;
}

function renderCard(this: CardProps) {
  console.log(this.title);
  console.log(this.content);
}

// renderCard();                    // 报错：this 上下文不匹配
renderCard.call({ title: "TS", content: "..." }); // ✅
```

显式 `this` 参数的核心价值是**约束调用上下文**——声明后，只有在 `this` 类型匹配时才能调用该函数。

### 类方法中的 this 丢失问题

将类方法提取为变量或作为回调传递时，`this` 绑定会丢失：

```typescript
class Counter {
  count = 0;
  
  increment() {
    this.count++;
    console.log(this.count);
  }
}

const counter = new Counter();
const fn = counter.increment; // 方法引用被提取
// fn(); // 运行时错误：strict 模式下 this 是 undefined，无法访问 count
```

三种修复方式：

```typescript
// 方式 1: bind 绑定
const fn1 = counter.increment.bind(counter);

// 方式 2: 箭头函数（属性初始化器语法）
class Counter {
  count = 0;
  increment = () => {
    this.count++;
  };
}

// 方式 3: 调用时绑定
const fn3 = () => counter.increment();
```

箭头函数作为类属性的写法最常见——它捕获的是外层作用域的 `this`（即类实例），不会在传递后丢失绑定。代价是每个实例都会创建一份函数副本，而非共享原型方法。

### 回调中的 this 类型标注

在处理事件监听或第三方库的回调时，显式 this 参数特别有用：

```typescript
interface EventEmitter {
  on(event: string, callback: (this: void, data: unknown) => void): void;
}

const emitter: EventEmitter = {
  on(event, callback) {
    // 实现略
  }
};

// callback 的 this 被标注为 void，回调函数内不能使用 this
emitter.on("data", function() {
  // this 的类型是 void
  // this.value = ""; // 编译报错
});
```

在回调函数的类型中将 `this` 标注为 `void`，意味着回调内的 `this` 不可用——这是一种防御性类型设计，防止在回调中意外引用错误的上下文。
