# MVVM 架构

### MVC 的问题在哪？

理解 MVVM 之前，需要先看 MVC 的职责划分。MVC 把应用拆成三层：Model（数据）、View（视图）、Controller（控制器）。用户操作 View，Controller 接收事件后更新 Model，Model 变化后再刷新 View。

早期后端 MVC 在模板引擎渲染场景下比较自然，但迁移到前端后，Controller 往往同时承担 DOM 操作和业务逻辑管理两类职责。随着页面交互增多，代码容易出现职责混杂、状态分散、维护成本上升的问题。每次数据变化都需要手动调用 `document.getElementById(...)` 等 API 更新 DOM，开发者需要同时关注数据状态和视图同步，复杂度会快速增加。

### MVVM 做了什么

MVVM 将原本分散在 Controller 中的视图同步职责抽象为 **ViewModel**。ViewModel 的核心能力是**双向数据绑定**：数据变化后视图自动更新，用户输入后数据自动同步。开发者无需直接维护大量 DOM 更新逻辑，框架会负责完成数据与视图之间的同步。

下面用一个简化实现说明 ViewModel 的工作方式：

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

输入框内容变化后，展示区域会同步更新，这体现了 ViewModel 在数据层和视图层之间承担的桥接作用。

### Vue2 和 Vue3 实现 MVVM 的差异

Vue2 使用 `Object.defineProperty` 做数据劫持，但它在监听数组下标变化和新增对象属性时存在天然限制，因此需要 `$set` 这类补充 API。Vue3 改用 `Proxy`，直接代理整个对象，新增属性、删除属性都能被拦截，响应式覆盖范围更完整。

### 数据流向图

```
View (DOM)  ←→  ViewModel (数据绑定)  ←→  Model (纯数据)
```

View 负责展示，Model 负责保存数据，ViewModel 负责数据与视图之间的同步。各层职责清晰后，视图变化、数据结构调整和同步逻辑可以相对独立地演进。
