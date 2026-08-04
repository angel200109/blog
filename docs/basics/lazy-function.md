# 惰性函数


### 基本模式

```js
function getValue() {
  const value = expensiveComputation() // 只算一次
  getValue = function() {
    return value
  }
  return value
}
```

函数第一次调用时算好了结果，然后把自己覆盖成直接返回缓存值的版本。后面再调用，完全不用走计算逻辑。

### 实际例子：事件监听兼容

```js
function addEvent(element, type, handler) {
  if (element.addEventListener) {
    addEvent = function(el, type, handler) {
      el.addEventListener(type, handler, false)
    }
  } else if (element.attachEvent) {
    addEvent = function(el, type, handler) {
      el.attachEvent('on' + type, handler)
    }
  } else {
    addEvent = function(el, type, handler) {
      el['on' + type] = handler
    }
  }
  addEvent(element, type, handler) // 用重写后的版本执行
}
```

只在第一次调用时做能力检测，之后每次调用都是直接走正确分支。

### 和闭包缓存的区别

```js
// 闭包缓存——每次都要判断
function getValue() {
  if (cached) return cached
  cached = compute()
  return cached
}

// 惰性函数——判断只做一次，之后函数本身被替换
function getValue() {
  const v = compute()
  getValue = () => v
  return v
}
```

惰性函数更"暴力"：连判断逻辑都给你干掉了。但代价是函数引用会变——如果你把函数存在变量里，覆盖后旧引用不会自动更新。

