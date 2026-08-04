# 函数传值：值传递还是引用传递


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

