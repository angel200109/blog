# JavaScript 数据类型全解

## 简介

面试八股文第一题八成就是它——JS 的数据类型有哪些？但别以为背个"七种原始类型加 Object"就完事了，真正要命的是理解它们存在哪、怎么存的、以及由此引发的一堆坑。

## 核心概念

### 原始类型：存在栈里的"小快灵"

原始类型一共七种：`Number`、`String`、`Boolean`、`null`、`undefined`、`Symbol`（ES6）、`BigInt`（ES11）。

这七兄弟的特点是**值不可变、直接存在栈里**。当你把一个原始值赋给另一个变量时，是复制了一份值，改一个不影响另一个。

```javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10，不受影响
```

### 引用类型：堆里放数据，栈里存地址

Object、Array、Function、Date 这些都是引用类型。真实数据存在堆内存里，变量里存的只是一个指向堆的地址。

```javascript
let obj1 = { name: 'angelina' };
let obj2 = obj1;
obj2.name = 'tom';
console.log(obj1.name); // 'tom'，两个变量指向同一个对象
```

这也就是为什么 `const` 声明的对象可以改属性——你改的是堆里的数据，地址本身没变。

### 为什么这么设计？

栈内存小而快，适合存固定大小的简单值；堆内存大但慢，适合存大小不确定的复杂结构。原始类型的大小编译时就确定了，而引用类型的结构可能在运行时动态变化——一个数组 push 一下，大小就变了。

## 实战场景

最常见的坑：函数传参时，你以为传了对象进去不会被改，其实外部已经被改了。

```javascript
function updateUser(user) {
  user.name = 'admin';
}
const currentUser = { name: 'guest' };
updateUser(currentUser);
console.log(currentUser.name); // 'admin' — 傻眼了吧
```

想避免的话，要么传之前浅拷贝一份 `{ ...user }`，要么在函数内部不要去直接改入参。

## 总结

原始类型存栈，传值；引用类型存堆，传地址。理解这个就理解了 JS 里 80% 的"奇怪行为"。
