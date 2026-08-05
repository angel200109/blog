# Vue 过滤器

### 过滤器的用途

过滤器用于对模板中的数据进行简单的格式化处理，不改变原始数据，仅在展示层面做转换。典型场景包括文本大小写转换、日期格式化、数值千分位分隔等。

### 定义过滤器

**局部注册**——在组件的 `filters` 选项中定义：

```js
export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
```

**全局注册**——通过 `Vue.filter` 注册后，所有组件模板中都可以使用：

```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

### 使用过滤器

两种使用方式：

```html
<!-- 双花括号插值 -->
<p>{{ message | capitalize }}</p>

<!-- v-bind 表达式中 -->
<div :title="rawTitle | capitalize"></div>
```

过滤器支持链式调用，前一个过滤器的输出作为后一个的输入：

```html
<p>{{ message | filterA | filterB }}</p>
```

过滤器也可以接收额外参数：

```html
<p>{{ price | formatCurrency('¥') }}</p>
```

### Vue3 中过滤器的移除

Vue3 不再内置过滤器功能。Vue 团队给出的理由是：过滤器的功能完全可以被计算属性或普通方法替代，而且这两种替代方案的类型推导和可维护性都优于过滤器。

迁移方式很简单——把过滤器逻辑提取为函数，在模板中直接调用或通过计算属性包裹：

```js
// Vue2 过滤器写法
filters: {
  formatDate(value) {
    return dayjs(value).format('YYYY-MM-DD')
  }
}
// 模板：{{ createTime | formatDate }}

// Vue3 替代写法
const formatDate = (value) => dayjs(value).format('YYYY-MM-DD')
// 模板：{{ formatDate(createTime) }}
```

如果项目中使用了大量全局过滤器，迁移时可以将它们集中导出为一个工具函数模块，在需要的地方按需引入。
