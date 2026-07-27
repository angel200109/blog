# 函数传值：值传递还是引用传递

## 简介

JS 函数传参到底传的是值还是引用？这个问题面试常问，平时开发也经常踩坑。简单说：JS 里只有值传递，但引用的值是什么决定了你改参数时会不会影响外部。

## 核心概念

### 基本类型：副本，互不影响

```js
function change(val) {
  val = 100
}

let num = 10
change(num)
console.log(num) // 10，没变
```

基本类型（number、string、boolean、null、undefined、symbol、bigint）传的是值的副本，函数里怎么改都不影响外部。

### 对象类型：传的是"地址的副本"

```js
function change(obj) {
  obj.name = 'jerry'   // 修改堆里的内容
  obj = { name: 'new' } // 让参数变量指向新地址
}

const person = { name: 'tom' }
change(person)
console.log(person.name) // 'jerry'，不是 'new'
```

拆分一下发生了什么：

1. 传参时 `obj` 拿到了 `person` 指向的堆地址（的副本）
2. `obj.name = 'jerry'` 通过这个地址修改了同一个对象——外部受影响
3. `obj = { name: 'new' }` 只是让局部变量 `obj` 指向了新地址——外部 `person` 不受影响

**关键点**：如果直接重新赋值整个对象（`obj = {...}`），只是在函数内部改了指针方向，对外部没影响。但如果通过属性修改（`obj.xxx = ...`），修改的是堆里的内容，外部能感知到。

### 一个常见陷阱

```js
function reset(list) {
  list = []           // 以为清空了
  list.push('new')    // 推到新数组去了
}

const arr = [1, 2, 3]
reset(arr)
console.log(arr) // [1, 2, 3]，根本没变！
```

想清空外部数组，应该这样：

```js
function reset(list) {
  list.length = 0  // 直接操作原数组
  list.push('new')
}
```

或者让外部变量指向新数组：

```js
function reset() {
  return ['new']
}
let arr = [1, 2, 3]
arr = reset(arr)
```

## 实战场景

React 里 setState 必须传新对象（不能直接改旧对象）就是这个原因——React 用引用比较来判断是否需要重新渲染，你直接 mutate 了旧对象，React 以为没变化就不会更新。

```js
// 错误做法
user.name = 'new name'
setUser(user) // React 发现引用没变，不会重渲染

// 正确做法
setUser({ ...user, name: 'new name' }) // 新引用，React 会重渲染
```

## 总结

JS 没有真正的引用传递，对象传参时传的是引用值的副本。能不能影响外部取决于你操作的是引用指向的内容还是引用本身。面试时一句话概括：**JS 只有按值传递，但对象的"值"是引用**。
