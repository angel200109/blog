# Vue 插槽的三种用法

### 默认插槽

插槽是 Vue 组件的一个基础特性，让父组件可以向子组件的指定位置注入内容。子组件用 `<slot>` 标签声明一个占位区，父组件在子组件标签内写入的内容会替换这个占位区。

```vue
<!-- 子组件 CardPanel.vue -->
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<!-- 父组件 -->
<CardPanel title="用户列表">
  <p>这是卡片内部的动态内容</p>
</CardPanel>
```

`<slot>` 中可以指定默认内容——如果父组件没有传入任何内容，则显示后备内容：

```vue
<slot>没有传入内容时的默认展示</slot>
```

### 具名插槽

一个组件内部可能需要多个插槽位置，比如页面布局有头部、主体和底部三个区域。具名插槽用 `name` 属性区分不同的插入点：

```vue
<!-- 子组件 LayoutPanel.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

父组件使用 `v-slot:` 或缩写 `#` 来指定向哪个插槽注入内容：

```vue
<LayoutPanel>
  <template #header>
    <h1>页面标题</h1>
  </template>

  <p>主体内容区域</p>

  <template #footer>
    <span>版权信息 &copy; 2026</span>
  </template>
</LayoutPanel>
```

没有显式命名的内容会自动填充到默认插槽（即没有 `name` 属性的 `<slot>`）。

### 作用域插槽

作用域插槽让子组件向父组件暴露内部数据，父组件根据这些数据决定如何渲染。

数据流向是：子组件通过 `:属性名` 将数据抛出，父组件通过 `v-slot` 接收。相比 props 的"父传子"，作用域插槽实现了"子传数据，父定渲染"的模式。

```vue
<!-- 子组件 ProductList.vue -->
<template>
  <ul>
    <li v-for="item in productList" :key="item.id">
      <slot name="item" :product="item" :index="index" />
    </li>
  </ul>
</template>

<script setup>
const productList = [
  { id: 1, name: '商品A', price: 99 },
  { id: 2, name: '商品B', price: 199 }
]
</script>

<!-- 父组件 -->
<ProductList>
  <template #item="{ product, index }">
    <span>{{ index + 1 }}. {{ product.name }} - ¥{{ product.price }}</span>
  </template>
</ProductList>
```

作用域插槽是组件封装和渲染逻辑分离的重要手段。它常用于列表组件（渲染逻辑交给父组件）、表格组件（自定义列）、弹窗组件（自定义内容），让组件保持通用性的同时不失灵活性。

### 插槽不是 props 的替代

初看之下，插槽和 props 都能把信息从外部传入组件，但它们的职责不同：

- **props** 传递的是数据，组件内部决定如何渲染
- **插槽** 传递的是渲染结构，组件内部决定"放在哪里"，外部决定"长什么样"

当组件需要让使用者自定义某个区域的 DOM 结构时，用插槽；当组件需要配置行为或数据时，用 props。两者搭配使用才是正确的组件设计方式。
