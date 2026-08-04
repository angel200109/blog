# 为什么需要 TypeScript


### JS 的"原罪"：动态类型

JS 的动态类型系统意味着类型在运行时才确定。好处是灵活，坏处也是灵活——你永远不知道一个变量下一秒会被赋值成什么：

```js
let price = 100
price = '免费'  // 纯 JS 完全不报错，但后面用到 price 做计算的地方就会崩
```

这类错误只能到运行时才暴露。TS 在编译阶段就能拦下来：

```ts
let price: number = 100
price = '免费'  // ❌ 编译错误：不能将 string 赋值给 number
```

### 重构的底气

假设后端把用户信息的 `userName` 改成了 `username`。纯 JS 项目里，你只能全局搜索一个个改，漏了一个上线就出 bug。TS 里改完类型定义，所有引用处的报错直接全出来了，挨个修就行。

```ts
interface User {
  username: string  // 改一下这里
}

function greet(user: User) {
  console.log(user.userName)  // ❌ 立即报错：属性 'userName' 不存在
}
```

### TS 和 JS 的关系

TS 是 JS 的超集——所有合法的 JS 都是合法的 TS。你可以在 TS 文件里混写，`tsc` 编译后输出纯 JS，运行时跟 TS 一点关系都没有。

TS 的类型检查只在**编译时**起作用，编译完就没了。所以它不是"让 JS 变成了静态类型语言"，而是"在写代码的时候帮你做静态检查"。

