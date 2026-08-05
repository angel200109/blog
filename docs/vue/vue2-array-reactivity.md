# Vue2 不能监听数组下标的原因

### 问题的表现

在 Vue2 的组件中，以下操作不会触发视图更新：

```javascript
// Vue2 组件中
this.items[0] = { id: 1, name: "新数据" };   // ❌ 视图不会更新
this.items.length = 0;                         // ❌ 视图不会更新
```

这两个操作虽然修改了数组，但 Vue2 的响应式系统感知不到变化。这是因为 Vue2 的响应式核心是 `Object.defineProperty`，而它在处理数组时做了刻意的取舍。

### Object.defineProperty 其实可以劫持数组索引

在技术层面，`Object.defineProperty` 完全有能力劫持数组索引的读写：

```javascript
const arr = [1, 2, 3];

// 对数组的每个索引定义 getter/setter——技术上可行
Object.defineProperty(arr, "0", {
  get() { return /* ... */; },
  set(val) { /* 可以在这里触发更新 */; }
});
```

既然技术上可行，Vue2 为什么不去做？

### 性能是唯一原因

尤雨溪在 Vue2 的文档和相关讨论中明确说明：不是"不能"劫持，而是"选择不去"劫持。原因在于性能与体验的权衡：

- 对于一个包含 10000 项的数组，为每个索引设置 getter/setter 需要执行 10000 次 `Object.defineProperty`，而且每次赋值和读取都会触发拦截逻辑。数据量越大，初始化延迟和运行开销越显著。
- 数组在业务中的常见操作不是索引读写，而是 `push`、`pop`、`sort` 等批量操作。为这些高频批量操作优化比逐个索引劫持更有价值。
- 框架需要保证性能可预测——如果一个大数据集意味着不确定的性能损耗，开发者的使用体验会很差。

因此 Vue2 放弃了对数组索引的劫持能力，选择重写 7 个变更方法来保证性能稳定。

### Vue2 中的数组变更方法

Vue2 重写了以下 7 个数组方法，在它们执行完后额外触发更新通知：

| 方法 | 触发条件 |
|------|---------|
| `push` | 向末尾添加元素 |
| `pop` | 移除末尾元素 |
| `shift` | 移除头部元素 |
| `unshift` | 向头部添加元素 |
| `splice` | 添加/删除/替换指定位置元素 |
| `sort` | 排序 |
| `reverse` | 反转 |

```javascript
// Vue2 组件中
this.items.splice(0, 1, { id: 1, name: "新数据" }); // ✅ 触发更新
this.items.push({ id: 4, name: "新增" });             // ✅ 触发更新
```

这些方法覆盖了大部分数组变更场景，开发者只需要养成使用这些方法而非直接索引赋值的习惯即可。

### 绕过限制的方案

当确实需要按索引赋值时，Vue2 提供了 `$set` 方法：

```javascript
// 等价于 this.items[0] = { id: 1, name: "新数据" }
this.$set(this.items, 0, { id: 1, name: "新数据" }); // ✅ 触发更新
```

`Vue.set` / `this.$set` 内部做了两件事：更新数组元素值，然后手动触发该数组的依赖更新。它实际上是一个"补丁式"API——绕过 `Object.defineProperty` 的限制，手动通知 Vue 数据发生了变化。

同样，`$set` 也可以用于给已有对象动态添加新属性：

```javascript
this.$set(this.user, "age", 25); // 给 user 对象添加 age 属性并触发更新
```

### Vue3 彻底解决了这个问题

Vue3 使用 `Proxy` 替代 `Object.defineProperty` 后，数组索引赋值天然被支持：

```javascript
// Vue3 中
const items = ref([1, 2, 3]);
items.value[0] = 99;       // ✅ 触发更新
items.value.length = 0;    // ✅ 触发更新
```

`Proxy` 的 `set` 陷阱在引擎层面拦截所有属性赋值操作（包括数组索引），不需要逐个遍历，也不需要在数组方法上做文章。这是 Vue3 响应式系统最重要的改进之一。
