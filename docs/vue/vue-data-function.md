# 为什么 Vue 中的 data 是函数而不是对象

### 组件复用引发的数据共享问题

Vue 组件定义时，`data` 选项必须是一个返回对象的**函数**，而不能直接写一个对象：

```javascript
// ❌ Vue 会在浏览器控制台中给出警告
Vue.component("counter", {
  data: { count: 0 },
  template: `<button @click="count++">{{ count }}</button>`
});

// ✅ 正确的写法
Vue.component("counter", {
  data() {
    return { count: 0 };
  },
  template: `<button @click="count++">{{ count }}</button>`
});
```

如果写成对象会怎样？同一个组件被多次使用时，所有实例会共享同一份 `data` 对象——因为对象是引用类型，多个实例引用的是同一个内存地址。

### 引用类型的陷阱

假设 Vue 允许将 `data` 写为对象形式：

```javascript
const SharedData = { count: 0 };

// 本质上类似于：
const instanceA = { data: SharedData };
const instanceB = { data: SharedData };

instanceA.data.count = 5;
console.log(instanceB.data.count); // 5 —— 两个实例的数据相互污染
```

当 `instanceA` 修改了 `count`，由于 `instanceA.data` 和 `instanceB.data` 指向同一个对象，`instanceB` 的视图也会意外更新。这在业务中表现为：切换到一个新创建的组件实例，它的状态却不是初始值，而是被另一个实例的修改污染了。

### 函数返回新对象解决该问题

将 `data` 定义为函数，每次创建组件实例时 Vue 都会调用它，拿到一个全新的数据对象：

```javascript
function createData() {
  return { count: 0 }; // 每次调用返回一个独立的对象
}

const instanceA = { data: createData() };
const instanceB = { data: createData() };

instanceA.data.count = 5;
console.log(instanceB.data.count); // 0 —— 互不影响
```

这样每个实例都持有自己独立的作用域，状态变更不会泄漏到其他实例。这是组件化开发中"每个组件实例拥有独立状态"的基本保证。

### 为什么根实例可以用对象

Vue 根实例（`new Vue({ ... })`）的 `data` 可以直接写对象：

```javascript
// 根实例——对象形式是允许的
new Vue({
  data: { message: "Hello" },
  el: "#app"
});
```

因为根实例在应用中只创建一次，不存在"多个实例共享数据"的问题。对象写法与函数写法在这里行为一致，Vue 就没有做强制限制。

### Vue3 中的变化

Vue3 的 Options API 保持了相同的约束——`data` 必须是函数。但如果使用 Composition API（`setup` 函数 / `<script setup>`），数据直接在 `setup` 内部用 `ref` 或 `reactive` 声明，`setup` 本身在每次组件实例化时执行一次，天然保证了每个实例有独立的数据作用域：

```vue
<script setup>
import { ref } from "vue";

// 每次创建组件实例时，setup 重新执行，声明新的 ref
const count = ref(0);
</script>
```

此时不再需要显式写 `data()` 函数——框架的初始化流程已经在每次实例化时重新运行 `setup`，等价于之前的"调用函数返回新对象"。
