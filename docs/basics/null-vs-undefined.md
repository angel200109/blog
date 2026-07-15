# null 和 undefined 的区别

## 简介

`null` 和 `undefined` 看起来都像"空"，但它们的来历完全不同。搞不清楚的话，调试时很容易被类型判断搞晕。

## 核心概念

### undefined：系统给的默认值

`undefined` 的意思是"**还没赋值**"。变量声明了但没初始化、函数没写 return、访问对象不存在的属性——统统返回 `undefined`。这是 JavaScript 引擎自动塞给你的。

```javascript
let x;
console.log(x); // undefined

function fn() {}
console.log(fn()); // undefined

const obj = {};
console.log(obj.notExist); // undefined
```

### null：开发者主动设定的空

`null` 的意思是"**这里应该有个对象，但目前为空**"。它是一个赋值操作，表示你明确知道这个变量将来要放对象，只是现在还没有。

```javascript
let user = null; // 明确表示"用户还没登录"
// ... 登录成功
user = { name: 'angelina' };
```

### typeof 的经典坑

`typeof null` 返回 `"object"`，这是 JS 诞生之初的 bug——当时用类型标签来判断，对象的标签是 `000`，而 `null` 的二进制表示全是 `0`，就被误判为对象了。这么多年一直没修，因为修了会有大量网站挂掉。

### 相等比较

```javascript
console.log(null == undefined);   // true，宽松比较下都代表"无"
console.log(null === undefined);  // false，类型不同
```

## 实战场景

判断一个变量到底是"没赋值"还是"明确为空"，在实际开发中很有用：

```javascript
function getUser(id) {
  if (id === undefined) {
    throw new Error('请提供用户 ID');
  }
  if (id === null) {
    return null; // 明确表示查不到
  }
  // 正常查询逻辑...
}
```

用 `== null` 可以同时判断 `null` 和 `undefined`，是个很实用的技巧：

```javascript
if (value == null) {
  // value 是 null 或 undefined 都会进来
}
```

## 总结

`undefined` 是系统的"我没被赋值"，`null` 是你的"我故意设为空"。`typeof null === "object"` 是历史遗留 bug，记住了就行。
