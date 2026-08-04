# Ajax 避免浏览器缓存方法


### 为什么会缓存

浏览器对 GET 请求会默认缓存。同一个 URL、同样的参数，第二次请求直接走缓存，根本不发网络请求。POST 默认不会缓存，但不是所有场景都适合用 POST。

### 方法一：加随机参数

```js
fetch('/api/data?_=' + Date.now())
```

每次 URL 都不一样，浏览器只能老老实实重新请求。简单暴力，但会污染浏览器的缓存存储。

### 方法二：设置请求头

```js
fetch('/api/data', {
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})
```

告诉浏览器"别缓存这个请求"。更优雅，但需要后端配合不冲突。

### 方法三：POST 替代 GET

如果数据请求量不大，用 POST 替代 GET 是最省事的方案——浏览器默认不缓存 POST 的响应体。

### jQuery 时代的方式

```js
$.ajax({
  url: '/api/data',
  cache: false // jQuery 自动在 URL 后加 _=timestamp
})
```

现在的项目基本不用 jQuery 了，但这个思路还在——用时间戳或者随机数让每次请求的 URL 独一无二。

