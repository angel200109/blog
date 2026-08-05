# v-model 实现原理

### v-model 是语法糖

`v-model` 是 Vue 提供的双向绑定指令，本质上是对单向数据绑定和事件监听的组合封装。以下两种写法等价：

```html
<input v-model="loginId" />

<!-- 等价于 -->
<input :value="loginId" @input="loginId = $event.target.value" />
```

- `:value="loginId"`：将数据绑定到 input 的 value 属性（数据 → 视图）
- `@input="loginId = $event.target.value"`：监听 input 事件，将用户输入同步回数据（视图 → 数据）

### 对不同表单元素的处理

`v-model` 在不同的表单元素上使用不同的属性和事件组合：

| 元素 | 绑定的属性 | 监听的事件 |
|------|----------|----------|
| `<input type="text">` / `<textarea>` | `value` | `input` |
| `<input type="checkbox">` | `checked` | `change` |
| `<input type="radio">` | `checked` | `change` |
| `<select>` | `value` | `change` |

```html
<!-- 文本输入 -->
<input v-model="username" />

<!-- 单个复选框：布尔值 -->
<input type="checkbox" v-model="isAgreed" />

<!-- 多个复选框：数组 -->
<input type="checkbox" value="apple" v-model="selectedFruits" />
<input type="checkbox" value="banana" v-model="selectedFruits" />

<!-- 单选 -->
<input type="radio" value="male" v-model="gender" />
<input type="radio" value="female" v-model="gender" />

<!-- 下拉选择 -->
<select v-model="city">
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

### 组件上的 v-model

在自定义组件上使用 `v-model` 时，Vue 将其展开为 `modelValue` prop 和 `update:modelValue` 事件：

```html
<CustomInput v-model="searchText" />

<!-- 等价于 -->
<CustomInput :modelValue="searchText" @update:modelValue="searchText = $event" />
```

子组件需要显式接收 `modelValue` prop，并在值变化时触发 `update:modelValue` 事件：

```vue
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

### v-model 的修饰符

Vue 为 `v-model` 提供了几个修饰符：

- **`.lazy`**：将监听事件从 `input` 改为 `change`，在输入框失去焦点或按回车时才同步数据
- **`.number`**：自动将输入值转换为数字类型
- **`.trim`**：自动去除输入值首尾的空白字符

```html
<input v-model.lazy="searchQuery" />
<input v-model.number="userAge" />
<input v-model.trim="displayName" />
```

这些修饰符的实现也遵循语法糖展开原则。以 `.lazy` 为例：

```html
<input v-model.lazy="searchQuery" />

<!-- 展开后监听的是 change 而非 input -->
<input :value="searchQuery" @change="searchQuery = $event.target.value" />
```
