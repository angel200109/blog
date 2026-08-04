# Vue 单向数据流

### 数据怎么流

Vue 组件间的数据流动遵循一个明确规则：**父组件通过 props 将数据传给子组件，子组件不能直接修改 props，只能通过 emit 事件通知父组件发起变更**。

```
父组件 → props → 子组件
父组件 ← emit  ← 子组件
```

这个循环始终保持单向：props 向下传递，事件向上通知。虽然写法上多了一层约束，但它能让数据来源和修改路径保持可追踪。

### 为什么不允许子组件直接改 props

假设你允许子组件直接改 props：

```vue
<!-- 父组件 -->
<Child :count="1" />

<!-- 子组件 -->
<script setup>
defineProps(['count'])
// 子组件直接改了 count...
</script>
```

这会带来两个典型问题：第一，父组件中的 `count` 和子组件显示的 `count` 可能不一致，形成**数据源分叉**，很难判断哪个值才是当前状态的来源；第二，多个子组件共享同一个 prop 时，某个子组件的直接修改不会被其他组件感知，问题定位成本会明显上升。

反过来，强制通过 emit 通知父组件修改，可以保证**所有写操作都发生在数据源头**。子组件只是发起变更请求，是否更新以及如何更新由父组件决定。这样查看父组件代码时，就能完整追踪数据的写入路径。

### 一个完整的父子通信示例

```vue
<!-- Parent.vue -->
<template>
  <div>
    <p>当前值：{{ count }}</p>
    <Child :count="count" @update-count="handleUpdate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const count = ref(0)

function handleUpdate(newVal: number) {
  count.value = newVal
}
</script>
```

```vue
<!-- Child.vue -->
<template>
  <button @click="increment">+1</button>
</template>

<script setup>
const props = defineProps<{ count: number }>()
const emit = defineEmits<{ 'update-count': [value: number] }>()

function increment() {
  emit('update-count', props.count + 1)
}
</script>
```

Child 只负责触发“加一”这个交互意图，真正的数据修改和校验都在 Parent 中完成。单向数据流的约束在小组件里看起来略显繁琐，但在复杂项目中，它能有效避免数据在不可见的位置被修改。
