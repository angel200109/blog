# Vue3 为什么用 Proxy 替换 Object.defineProperty

### Vue2 的响应式困局

Vue2 的响应式系统基于 `Object.defineProperty`，通过递归遍历对象的每个属性，给它们设置 getter 和 setter 来拦截读写操作。这套方案虽然在当时足够用，但存在三个结构性缺陷：

**新增和删除属性无法被检测**

`Object.defineProperty` 只能劫持对象上已存在的属性。当开发者动态添加新属性或删除已有属性时，Vue2 无法感知，因此需要额外的 API：

```javascript
// Vue2 中，直接添加新属性不会触发视图更新
this.product.discount = 0.8;          // 不生效
// 必须用 $set
this.$set(this.product, "discount", 0.8); // 生效

// 删除属性也需要专门的方法
this.$delete(this.product, "deprecatedField");
```

**数组操作的拦截需要重写方法**

`Object.defineProperty` 可以通过索引劫持数组元素，但 Vue2 选择不去做——原因是数组长度可能很大，遍历每个索引设置 getter/setter 的性能开销不可控。因此 Vue2 转而重写了数组的 7 个变更方法（`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`），在这些方法内部手动触发更新：

```javascript
// Vue2 的数组拦截策略
const originalPush = Array.prototype.push;
Array.prototype.push = function(...args) {
  const result = originalPush.apply(this, args);
  // 手动通知依赖更新
  return result;
};
```

这种重写带来了两个问题：直接通过索引赋值（`vm.items[0] = newItem`）不触发更新；`length` 的修改（`vm.items.length = 0`）也不触发更新。

**初始化时需要递归遍历整个对象**

Vue2 的响应式转换在组件初始化阶段完成：对一个包含深层嵌套的对象，`Object.defineProperty` 需要递归遍历每一层的每一个属性。如果一个对象有上万个属性（比如一颗很大的树形数据结构），初始化延迟会明显增加，同时也会产生大量闭包，占用额外内存。

### Proxy 解决的三个问题

Vue3 用 `Proxy` 替代 `Object.defineProperty`，本质上是将拦截的粒度从"逐个属性"提升到"整个对象"，一次性解决了上述三个问题：

**新增和删除属性自动被拦截**

`Proxy` 可以拦截对象级别的 `set` 和 `deleteProperty` 操作，无论操作的属性是否在定义时存在：

```javascript
const product = reactive({ name: "商品A", price: 100 });

// 新增属性——自动触发更新
product.discount = 0.8;

// 删除属性——自动触发更新
delete product.price;
```

`Proxy` 的 `set` 拦截器在每次给对象赋值时都会触发，不需要事先知道对象有哪些 key。

**数组操作不再需要重写方法**

`Proxy` 可以直接拦截数组的索引赋值和 `length` 修改：

```javascript
const list = reactive([1, 2, 3]);

list[0] = 99;         // ✅ set 拦截器触发
list.length = 0;      // ✅ set 拦截器触发
list.push(4);         // ✅ set 拦截器触发
```

`list[0] = 99` 之所以能触发更新，是因为 `Proxy` 的 `set` 陷阱对数组索引的赋值同样生效——Vue 不需要再手动包装数组方法。

**按需代理而非全量递归**

Vue3 的 `reactive` 只在访问到深层属性时才将其转为响应式（懒代理）。这使得初始化性能不再与数据规模成正比：

```javascript
const state = reactive({
  level1: {
    level2: {
      level3: { /* 大量数据 */ }
    }
  }
});

// 此时只有 state 和 state.level1 被代理
// state.level1.level2 和更深层的对象在被访问前不会被转为响应式
```

### Proxy 的额外能力

除了解决 Vue2 的三个痛点，`Proxy` 还能拦截更多操作类型：

| 拦截操作 | 对应陷阱 | 实际场景 |
|---------|---------|---------|
| 属性读取 | `get` | 依赖收集 |
| 属性赋值 | `set` | 触发更新 |
| 属性删除 | `deleteProperty` | 删除属性时触发更新 |
| `in` 操作符 | `has` | `v-if` 中的 key 检查 |
| `Object.keys` | `ownKeys` | 遍历响应式对象的 key |

这 13 种 Proxy 陷阱中，Vue3 的响应式系统主要使用了 `get`、`set`、`deleteProperty`、`has` 和 `ownKeys`，比 `Object.defineProperty` 只能拦截读写操作的覆盖面更广。

### 兼容性代价

`Proxy` 是 ES6 的 API，无法通过 polyfill 在旧浏览器中实现等效行为（`Proxy` 的拦截能力需要引擎级别的支持）。因此 Vue3 不支持 IE11 及以下浏览器。对于需要兼容老旧浏览器的项目，这是选型时需要权衡的点。
