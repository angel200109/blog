# Vue 组件通讯的几种方式

### 组件通讯的本质

组件树中的通讯本质上是数据的流转方向问题。父子之间需要双向传递数据，兄弟之间需要共享状态，跨层级组件需要避免逐层透传。Vue 为不同层级的通讯场景提供了对应的机制。

### 父子组件通讯

**Props** 是父组件向子组件传递数据的基本方式。数据流向严格单向——父组件定义并传入，子组件声明接收，子组件不应直接修改 props 的值：

```vue
<!-- 父组件 -->
<template>
  <UserCard :nickname="userName" :avatar="userAvatar" />
</template>

<!-- 子组件 -->
<script setup>
defineProps({
  nickname: String,
  avatar: String
});
</script>
```

**$emit** 是子组件通知父组件的渠道。子组件通过触发自定义事件将数据"回传"给父组件，由父组件决定如何响应：

```vue
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['update', 'delete']);

function handleSave() {
  emit('update', { id: 1, content: '修改后的内容' });
}
</script>

<!-- 父组件 -->
<template>
  <Editor @update="onUpdate" />
</template>
```

**ref** 允许父组件直接获取子组件实例或 DOM 元素。在组合式 API 中需要子组件通过 `defineExpose` 明确暴露要对外访问的属性或方法：

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue';
import ChildForm from './ChildForm.vue';

const formRef = ref(null);

function submit() {
  formRef.value.validate(); // 调用子组件暴露的方法
}
</script>

<template>
  <ChildForm ref="formRef" />
</template>
```

### 兄弟组件通讯

两个没有直接父子关系的组件共享数据时，可以借助 EventBus 发布订阅模式。Vue 3 中推荐使用 `mitt` 这类轻量库替代 Vue 2 内置的 EventBus：

```javascript
// eventBus.js
import mitt from 'mitt';
export const eventBus = mitt();

// 组件 A —— 发送
eventBus.emit('user-login', { userId: 123 });

// 组件 B —— 接收
eventBus.on('user-login', (data) => {
  console.log(data.userId);
});
```

`$parent` 和 `$root` 提供了直接访问父组件或根组件实例的通道。这类方式与组件树结构强耦合，适合原型开发或简单场景，在复杂项目中建议用状态管理替代。

### 跨层级组件通讯

**Provide / Inject** 专为祖先与后代之间的跨层级通讯设计。祖先组件通过 `provide` 提供数据，任意深度的后代通过 `inject` 获取——跳过中间的层层透传：

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue';

const theme = ref('dark');
provide('theme', theme);
</script>

<!-- 任意后代组件 -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme', 'light'); // 第二个参数是默认值
</script>
```

Provide / Inject 的数据默认不是响应式的。如果需要后代组件随数据变化而更新，应当传入 `ref` 或 `reactive` 包装的响应式数据。

**attrs** 传递的是父组件在子组件上声明的、但子组件未通过 `props` 或 `emits` 显式接收的属性（包括 class、style 和事件监听器）。Vue 3 中，`$attrs` 包含了透传的属性和事件，可以直接通过 `v-bind="$attrs"` 分发给更深层的组件：

```vue
<!-- 中间层组件 -->
<template>
  <DeepChild v-bind="$attrs" />
</template>
```

### 复杂关系：集中式状态管理

当多个组件需要共享和修改同一份状态、且组件关系复杂时，状态管理库将数据提升到组件树之外的全局 store 中。Vue 生态中 Vuex 和 Pinia 是两种主流方案。

Vuex 围绕单一状态树组织数据，通过 `state` 存储数据、`getters` 派生计算值、`mutations` 同步修改、`actions` 处理异步逻辑、`modules` 划分模块。核心原则是数据单向流动：组件通过 `dispatch` 触发 action，action 通过 `commit` 调用 mutation 修改 state，state 变化自动同步到所有使用该状态的组件。

Pinia 是 Vue 3 官方推荐的状态管理方案，API 更简洁且原生支持 TypeScript：

```javascript
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  actions: {
    addItem(product) {
      this.items.push(product);
    }
  },
  getters: {
    totalCount: (state) => state.items.length
  }
});
```

### 场景决策建议

| 场景 | 推荐方式 |
|------|---------|
| 父→子传递数据 | props |
| 子→父通知变更 | emits |
| 父组件调用子组件方法 | ref + defineExpose |
| 不相关的组件间传递简单事件 | mitt / EventBus |
| 多层嵌套的数据透传 | provide / inject |
| 全局共享、多处修改的复杂状态 | Pinia |

选择通讯方式的权衡点在于组件之间的耦合度。props + emits 显式定义了组件契约，耦合度最低、可维护性最高。EventBus 和 provide / inject 灵活但隐式，需要配合 TypeScript 和明确的命名约定来降低追踪成本。状态管理库适合多组件共享同一份数据的场景——这是它与简单数据传递的本质区别。
