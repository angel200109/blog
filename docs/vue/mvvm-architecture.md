# MVVM 架构

### MVC 的问题在哪？

在聊 MVVM 之前，得先看看 MVC。MVC 把应用拆成三层：Model（数据）、View（视图）、Controller（控制器）。用户操作 View，Controller 收到事件后更新 Model，Model 变化后再手动刷新 View。

早期后端 MVC 用得很顺手（模板引擎渲染），但搬到前端就出问题了：**Controller 既要处理 DOM 操作，又要管理业务逻辑**，项目一大直接变成意大利面条。每个操作都要写 `document.getElementById(...)`，数据一变就得手动更新一坨 DOM，心智负担贼重。

### MVVM 做了什么

MVVM 把 Controller 换成了 **ViewModel**。ViewModel 的核心能力是**双向数据绑定**——数据变了视图自动更新，用户输入了数据自动同步。你不用再手动操作 DOM，框架替你做了。

来看个简化版实现，感受一下 ViewModel 怎么工作：

```html
<!-- View 层 -->
<input id="input" />
<div id="content"></div>

<script>
  window.onload = () => {
    // Model 层：存数据
    const data = { inputVal: '' }

    // ViewModel 层：数据 ↔ 视图 的桥梁
    const input = document.getElementById('input')
    input.addEventListener('input', (e) => {
      proxy.inputVal = input.value  // 视图 → 数据
    })

    const proxy = new Proxy(data, {
      set: (target, key, value) => {
        if (key === 'inputVal') {
          document.getElementById('content').innerHTML = value // 数据 → 视图
        }
        return true
      }
    })
  }
</script>
```

输入框敲一个字，下面的展示区立刻同步——这就是 ViewModel 在中间做桥梁的效果。

### Vue2 和 Vue3 实现 MVVM 的差异

Vue2 用 `Object.defineProperty` 做数据劫持，但它在监听数组下标变化和新增对象属性时天然受限，所以才有 `$set` 这种补丁式 API。Vue3 换成了 `Proxy`，直接代理整个对象，新增属性、删除属性都能自动感知，用起来顺滑很多。

### 数据流向图

```
View (DOM)  ←→  ViewModel (数据绑定)  ←→  Model (纯数据)
```

View 只负责展示，Model 只负责存数据，ViewModel 夹在中间负责双向同步。各层职责清晰，随便改哪层都不会污染另一层。
