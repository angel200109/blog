# 判断一个对象是不是空的，有四种写法

别笑，判断空对象是前端日常操作。比如接口返回了数据要不要渲染空状态、表单提交前要不要校验。来看看哪招最好用。

## 方法 1：`Object.keys()`

```javascript
const isEmpty = obj => Object.keys(obj).length === 0;
```

最常用，也是最推荐的。`Object.keys()` 只返回自身可枚举属性，不会碰到原型链上的东西。

## 方法 2：`for...in`

```javascript
const isEmpty = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
```

`for...in` 会遍历原型链上的属性，所以要加 `hasOwnProperty` 做过滤。比 `Object.keys()` 啰嗦，不推荐。

## 方法 3：`JSON.stringify()`

```javascript
const isEmpty = obj => JSON.stringify(obj) === '{}';
```

能跑，但太重了。对象大了性能堪忧，而且碰到 `undefined`、函数这些无法序列化的属性会直接丢——一个 `{ name: undefined }` 序列化后变成 `"{}"`，误判为空。

## 方法 4：`Reflect.ownKeys()`

```javascript
const isEmpty = obj => Reflect.ownKeys(obj).length === 0;
```

这招比 `Object.keys()` 更"狠"——它连 Symbol 属性和不可枚举属性都算进去。如果你的对象可能包含 Symbol key，用这个更安全。

```javascript
const sym = Symbol('secret');
const obj = { [sym]: 'hidden' };
Object.keys(obj).length;        // 0 —— 漏了！
Reflect.ownKeys(obj).length;    // 1 —— 抓到了
```

## 选哪个

日常开发中 `Object.keys(obj).length === 0` 够用了。如果你不确定对象有没有 Symbol 属性（比如在写通用工具函数），用 `Reflect.ownKeys()` 兜底更稳。
