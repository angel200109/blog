# Vue 路由传参的几种方式

### params 传参

params 传参需要配合动态路由使用，参数是 URL 路径的一部分：

```js
// 路由定义
const routes = [
  { path: '/user/:userId', component: UserDetail }
]

// 跳转时传递参数
router.push({ name: 'user', params: { userId: '2024' } })
// 结果：/user/2024

// 组件内获取
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params.userId) // '2024'
```

params 的优点是 URL 干净，参数直接嵌入路径中。但刷新页面时参数不会丢失，因为参数本身就是 URL 的一部分。

在使用 `path` 配合 `params` 时需要注意：如果写的是 `router.push({ path: '/user', params: { userId: '2024' } })`，params 会被忽略。动态路由必须通过 `name` 跳转，或者直接在 path 中拼接参数值。

### query 传参

query 传参将参数放在 URL 的查询字符串中：

```js
router.push({ path: '/search', query: { keyword: 'vue', page: '2' } })
// 结果：/search?keyword=vue&page=2

// 组件内获取
console.log(route.query.keyword) // 'vue'
```

query 的优点是灵活：不需要事先在路由配置中声明参数，可以随时追加。缺点是 URL 较长，不适合传递大量数据，刷新页面时参数保留在地址栏中。

### 路由 props 解耦

直接在组件中通过 `$route.params` 或 `$route.query` 获取参数，会让组件与路由实例强耦合，不利于组件复用和单元测试。Vue Router 提供了 `props` 属性来解耦：

```js
// 路由配置
const routes = [
  {
    path: '/user/:userId',
    component: UserDetail,
    props: true  // 将 route.params 自动映射为组件的 props
  }
]

// 组件中
export default defineComponent({
  props: {
    userId: {
      type: String,
      required: true
    }
  }
})
```

除了 `props: true`（布尔模式）之外，还支持函数模式和对象模式。函数模式可以对参数做转换或合并多个来源的数据。

### state 传参（隐式传参）

histroy 模式下，`router.push` 可以传递 `state`：

```js
router.push({
  name: 'detail',
  state: { fromPage: 'list' }
})
```

`state` 中的数据保存在 `history.state` 中，不会出现在 URL 上。但刷新页面时 `state` 会丢失（除非配合 `history.replaceState` 显式保存），因此适合传递"仅本次导航有效"的临时数据，比如上一个页面标识、来源标记等。

### params 与 query 的选择

- 参数是资源的标识（如 ID、用户名）且希望 URL 干净时，使用 params。
- 参数是筛选条件、排序、分页等可选信息时，使用 query。
- 参数体积较大或包含敏感信息时，考虑 state 或全局状态管理（如 Pinia），不要塞进 URL。
