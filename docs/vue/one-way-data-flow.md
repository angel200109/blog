# Vue 单向数据流

### 数据怎么流

Vue 组件间的数据流动有一个硬性规则：**父组件通过 props 把数据传给子组件，子组件不能直接改 props，只能通过 emit 事件通知父组件去改**。

```
父组件 → props → 子组件
父组件 ← emit  ← 子组件
```

这个循环永远是单向的——props 向下，事件向上。看起来绕，但正因为这个约束，数据流才可控。

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

这会出两种麻烦：第一，父组件的 `count` 和子组件显示的 `count` 不一致了，**数据源分叉**，你根本不知道"真值"在哪；第二，多个子组件共享同一个 prop 时，A 改了 B 不知道，Bug 追起来想死。

反过来，强制通过 emit 通知父组件去改，就保证了**所有修改都在数据源头发生**，子组件只是"请求"变更，做不做决定的是父组件。这样任何时候看父组件代码，就能知道数据的所有写入路径。

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

Child 只负责"+1"这个意图的触发，真正的数据修改和验证都在 Parent 里完成。这种单向流的约束看似麻烦，但项目越复杂，你会越感谢它——数据从来不会在你不知道的地方被偷偷改掉。
