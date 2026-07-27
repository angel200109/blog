# TypeScript 中的 this 类型

## 简介

TS 里的 `this` 比 JS 里的更难搞——JS 里 `this` 的问题出在运行时绑定，TS 里多了一层：编译时 `this` 的类型推断经常不按你的预期走。

## 核心概念

### this 参数：声明你期望的 this

TS 允许在函数第一个参数位置声明 `this` 的类型。它不是真正的参数，不会出现在编译后的代码中：

```ts
function handleClick(this: HTMLButtonElement, event: MouseEvent) {
  console.log(this.textContent)  // ✅ this 是 HTMLButtonElement
}

button.addEventListener('click', handleClick)
```

如果 `this` 类型不匹配，编译时就会报错：

```ts
function greet(this: { name: string }) {
  console.log(`Hello, ${this.name}`)
}

greet()  // ❌ this 上下文类型不匹配
greet.call({ name: 'tom' })  // ✅ 通过 call 指定 this
```

### 类方法中的 this

类成员方法中，`this` 自动指向当前实例：

```ts
class Counter {
  count = 0

  increment() {
    this.count++  // ✅ this 是 Counter 实例
  }
}
```

但如果把方法当回调传出去，`this` 就丢了：

```ts
class Counter {
  count = 0

  increment() {
    this.count++  // ❌ 运行时 this 可能是 undefined
  }
}

const c = new Counter()
setTimeout(c.increment, 1000)  // 方法脱离了实例上下文
```

修复方式：

```ts
// 方案 1：箭头函数属性
class Counter {
  count = 0
  increment = () => {
    this.count++  // ✅ 箭头函数自动绑定 this
  }
}

// 方案 2：显式 bind
setTimeout(c.increment.bind(c), 1000)

// 方案 3：声明 this 参数
class Counter {
  count = 0
  increment(this: Counter) {
    this.count++
  }
}
```

### this 作为返回类型：链式调用

`this` 可以作为方法的返回值类型，让子类继承时自动适配类型：

```ts
class Builder {
  setName(name: string): this {
    // ...
    return this
  }
}

class SubBuilder extends Builder {
  setAge(age: number): this {
    // ...
    return this
  }
}

const b = new SubBuilder()
b.setName('tom').setAge(25)  // ✅ 链式调用，setAge 在 setName 之后仍然可用
```

如果不用 `this` 而用 `Builder` 做返回类型，子类调 `setName` 后会返回 `Builder` 类型，`setAge` 就不存在了。

## 实战场景

**事件处理函数**是 `this` 问题的高发区：

```ts
class SearchBox {
  constructor(private input: HTMLInputElement) {
    this.input.addEventListener('input', this.onInput)
  }

  onInput(this: SearchBox, event: Event) {
    console.log(this.input.value)  // ❌ 运行时 this 可能是 input 元素
  }
}
```

用 `this` 参数声明可以在编译时发现这类问题。修复：

```ts
// 箭头函数
this.input.addEventListener('input', (e) => this.onInput(e))
```

**回调中的 this 类型：**

```ts
function map<T, U>(arr: T[], callback: (this: typeof arr, item: T, index: number) => U): U[] {
  return arr.map((item, index) => callback.call(arr, item, index))
}

map([1, 2, 3], function() {
  console.log(this)  // this 被类型系统约束为 number[]
  return this.length
})
```

## 总结

TS 的 `this` 类型主要解决三个问题：指定回调中期望的 `this` 类型（`this` 参数）、保证链式调用时类型不丢失（`this` 返回类型）、和箭头函数配合避免 `this` 丢失。类方法传出去之前，先用箭头函数或 `bind` 绑定。
