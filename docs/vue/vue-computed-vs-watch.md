# computed、watch 和 method 怎么选

### 三者的定位

Vue 提供了三种处理派生数据和副作用的方式，各自有不同的使用场景：

| | computed | watch | method |
|---|---|---|---|
| **本质** | 派生状态（声明式） | 副作用执行（命令式） | 事件响应 |
| **缓存** | 有（依赖不变不重新计算） | 无 | 无（每次调用都重新执行） |
| **异步** | 不支持 | 支持 | 取决于调用方 |
| **触发时机** | 依赖变化后、被访问时 | 依赖变化后立即执行 | 手动调用 |
| **返回值** | 必须有 | 不需要 | 可选 |

### computed：需要缓存的计算结果

`computed` 适合依赖其他响应式数据、需要自动缓存的计算场景。模板中多次引用同一个计算属性，底层函数只会执行一次：

```vue
<script setup>
import { ref, computed } from "vue";

const price = ref(120);
const quantity = ref(2);

const total = computed(() => price.value * quantity.value);
</script>

<template>
  <p>单价：{{ price }}</p>
  <p>数量：{{ quantity }}</p>
  <p>总价：{{ total }}</p>
  <p>含税总价：{{ total * 1.13 }}</p>
  <!-- total 的计算只在依赖（price、quantity）变化时执行，模板中引用两次不会重复计算 -->
</template>
```

因为 `computed` 有缓存机制，即使页面上多处渲染 `{{ total }}`，只要 `price` 和 `quantity` 没变，计算逻辑只跑一次。

### watch：需要执行副作用时

`watch` 适合"当某个数据变化时，去做一件与视图渲染无关的事情"——比如发网络请求、操作 DOM、更新第三方库的状态：

```vue
<script setup>
import { ref, watch } from "vue";

const searchText = ref("");
const searchResults = ref([]);

watch(searchText, async (newText) => {
  if (newText.length < 2) {
    searchResults.value = [];
    return;
  }
  // 发请求搜索——这是副作用，不适合放在 computed 中
  const response = await fetch(`/api/search?q=${newText}`);
  searchResults.value = await response.json();
});
</script>
```

`watch` 支持异步操作，回调函数可以是 `async` 函数，而 `computed` 的回调必须是同步的。

### method：事件驱动的逻辑

`method` 不会被 Vue 自动调用，只在模板中的事件绑定（`@click`、`@input` 等）或手动调用时才执行。没有任何缓存：

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

const formatCount = () => {
  // 每次调用都会执行，没有缓存
  return count.value > 9 ? `${count.value}` : `0${count.value}`;
};
</script>

<template>
  <p>{{ formatCount() }}</p>
  <button @click="count++">加一</button>
</template>
```

如果 `formatCount` 替换为 `computed`，当 `count` 不变时，模板中多次引用不会重复执行——这是两者在渲染阶段的本质差异。

### computed 与 watch 的核心区别

两者的本质差异不在于"能不能异步"，而在于**定义模型的不同**：

- `computed` 的语义是：**依赖值变化 → 计算值自动变化**。这是一个同步的、可推导的关系。如果 `computed` 支持异步，就会出现"依赖值已经变了，但计算值还没更新"的中间态，违背了"声明式派生"的基本约定。
- `watch` 的语义是：**监听到变化 → 执行某个动作**。这个动作可以是同步的（写 cookie）、异步的（发网络请求）、甚至什么都不做。它描述的是"变化后的响应"，而非"状态的推导"。

### 场景化决策

| 场景 | 推荐方式 |
|------|---------|
| 根据已有数据计算一个新值，且需要在模板中展示 | `computed` |
| 数据变化后需要发请求、操作 DOM、触发外部逻辑 | `watch` |
| 响应用户点击、输入等事件 | `method` |
| 需要监听深层对象属性变化 | `watch` + `deep: true` |
| 同一个计算结果在模板中多次使用 | `computed`（利用缓存） |
