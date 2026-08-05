# created 和 mounted 有什么区别

### 时间节点上的差异

Vue 组件的生命周期按顺序分为三个阶段：创建 → 挂载 → 更新 → 销毁。

`created` 在组件实例创建完成后触发，此时数据（`data`、`computed`、`methods`、`watch`）已经初始化完毕，但**模板还没有被编译成 DOM 结构，页面上没有任何东西**。

`mounted` 在组件被挂载到 DOM 之后触发，此时 `this.$el` 已经指向真实的 DOM 节点，可以安全地进行 DOM 操作、访问子组件实例、设置事件监听器。

### 能不能做的事

```javascript
export default {
  data() {
    return { message: "Hello" };
  },
  created() {
    // ✅ 可以：读取和修改 data
    this.message = "Updated";

    // ✅ 可以：调用 methods
    this.fetchData();

    // ❌ 不可以：操作 DOM——页面上还没有这个组件的 DOM
    // this.$refs.input.focus(); // 报错：input 还不存在

    // ❌ 不可以：访问子组件——子组件还没挂载
  },
  mounted() {
    // ✅ 可以：操作 DOM
    this.$refs.input.focus();

    // ✅ 可以：添加原生事件监听（记得在 beforeDestroy / onBeforeUnmount 中移除）
    window.addEventListener("resize", this.handleResize);

    // ✅ 可以：获取元素的尺寸、位置
    const rect = this.$el.getBoundingClientRect();
  }
};
```

`created` 适合做**纯数据层面的初始化**——发请求拉数据、设置状态初始值、注册全局事件总线等不需要 DOM 的操作。`mounted` 适合做**依赖 DOM 存在**的操作。

### 父子组件的执行顺序

父组件和子组件的生命周期钩子不会交错，而是有严格的层级顺序：

```
父 beforeCreate → 父 created → 父 beforeMount →
  子 beforeCreate → 子 created → 子 beforeMount →
  子 mounted →
父 mounted
```

规律是：父组件创建完成后开始创建子组件，子组件全部挂载完成后父组件才算挂载完成。也就是说，`created` 是"父先子后"，`mounted` 是"子先父后"。

### Vue3 中的变化

Vue3 的组合式 API 中，`setup` 函数替代了 `created` 和 `beforeCreate` 两个钩子——它在组件创建之前、生命周期钩子调用之前执行，此时数据已经声明但不是响应式的完整形态。如果需要等价于 `created` 的逻辑，直接写在 `setup` 顶层即可；等价于 `mounted` 的逻辑用 `onMounted`：

```vue
<script setup>
import { ref, onMounted } from "vue";

// 这里等价于 created
const message = ref("Hello");
fetchInitialData();

onMounted(() => {
  // 这里等价于 mounted
  document.title = message.value;
});
</script>
```

Vue3 没有直接的 `created` 钩子——因为 `setup` 本身就是"组件创建阶段"的入口，再去定义一个 `onCreated` 多余且容易误导。
