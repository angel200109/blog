import { DefaultTheme } from "vitepress";

export const defaultSidebar = [
  {
    text: "HTML&CSS",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/basics/",
      },
    ],
  },
  {
    text: "Vue.js",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/vue/",
      },
      { text: "MVVM 架构", link: "/vue/mvvm-architecture" },
      { text: "Vue 单向数据流", link: "/vue/one-way-data-flow" },
      { text: "Vue3 渲染原理", link: "/vue/vue3-rendering" },
      { text: ".vue 单文件组件编译流程", link: "/vue/vue-sfc-compilation" },
      { text: "Vue 模板编译流程", link: "/vue/template-compilation" },
      { text: "Vue 响应式原理", link: "/vue/reactivity-principle" },
      { text: "Vue 的优点和特点", link: "/vue/vue-advantages" },
      { text: "Vue2 和 Vue3 的区别", link: "/vue/vue2-vs-vue3" },
      { text: "Vue3 编译优化", link: "/vue/vue3-compilation-optimization" },
      { text: "Vue3 为什么比 Vue2 快", link: "/vue/vue3-faster-than-vue2" },
      { text: "Vue3 DOM Diff 算法", link: "/vue/vue3-dom-diff" },
      { text: "Vue 组件通讯的几种方式", link: "/vue/vue-component-communication" },
    ],
  },
  {
    text: "React",
    collapsible: true,
    items: [
      { text: "开始", link: "/react/" },
      { text: "Fiber", link: "/react/Fiber" },
      { text: "Hooks", link: "/react/hooks" },
      { text: "useEffect 闭包陷阱", link: "/react/useeffect-closure-trap" },
    ],
  },
  {
    text: "JS&TS",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/typescript/",
      },
      { text: "JavaScript 数据类型全解", link: "/basics/js-data-types" },
      { text: "null 和 undefined 的区别", link: "/basics/null-vs-undefined" },
      { text: "JavaScript 类型判断三剑客", link: "/basics/js-type-check" },
      { text: "JS 装箱机制", link: "/basics/js-boxing" },
      { text: "JavaScript 类型转换", link: "/basics/js-type-coercion" },
      { text: "== 和 === 的本质区别", link: "/basics/equality-comparison" },
      { text: "const、let、var 该怎么选", link: "/basics/const-let-var" },
      { text: "变量提升与暂时性死区", link: "/basics/hoisting-tdz" },
      { text: "Symbol：独一无二的值", link: "/basics/symbol" },
      { text: "数组去重的五种方式", link: "/basics/array-deduplication" },
      { text: "清空数组的几种姿势", link: "/basics/array-clear" },
      { text: "一张图记住 JS 数组常用方法", link: "/basics/array-operations" },
      { text: "一个 reduce 搞定数组五连问", link: "/basics/array-reduce" },
      { text: "伪数组不是数组，但也别慌", link: "/basics/array-like" },
      { text: "怎么区分数组和对象", link: "/basics/array-vs-object" },
      { text: "判断两个对象是否相等", link: "/basics/object-equality" },
      { text: "判断一个对象是不是空的", link: "/basics/empty-object" },
      { text: "创建 JS 对象的五种方式", link: "/basics/create-object" },
      { text: "遍历 JS 对象的四种方式", link: "/basics/iterate-object" },
      { text: "原生对象、内置对象、宿主对象", link: "/basics/object-types" },
      { text: "静态方法和实例方法的区别", link: "/basics/static-vs-instance-methods" },
      { text: "JavaScript 函数的几种写法", link: "/basics/function-writing-styles" },
      { text: "回调地狱是怎么回事", link: "/basics/callback-hell" },
      { text: "Promise 解决了什么问题", link: "/basics/promise-basics" },
      { text: "async/await 到底做了什么", link: "/basics/async-await" },
      { text: "Promise.all / allSettled / any / race 怎么选", link: "/basics/promise-combinators" },
      { text: "链式调用的实现方式", link: "/basics/method-chaining" },
      { text: "Promise 和 async/await 到底是什么关系", link: "/basics/promise-async-relationship" },
      { text: "原型链：JavaScript 的继承机制", link: "/basics/prototype-chain" },
      { text: "原型链中的优先级规则", link: "/basics/prototype-practice" },
      { text: "JavaScript 作用域与经典的 setTimeout 循环问题", link: "/basics/js-scope-settimeout" },
      { text: "DOM 事件流：捕获、目标与冒泡", link: "/basics/dom-event-flow" },
      { text: "事件委托的原理与实践", link: "/basics/event-delegation" },
      { text: "TS any 与 unknown 的区别", link: "/typescript/any-vs-unknown" },
      { text: "TS void 与 never 的区别", link: "/typescript/void-vs-never" },
      { text: "TS interface 与 type 的区别", link: "/typescript/interface-vs-type" },
      { text: "TypeScript 泛型详解", link: "/typescript/generics" },
    ],
  },
  {
    text: "前端工程化",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/engineering/",
      },
    ],
  },
  {
    text: "计算机网络",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/network/",
      },
    ],
  },
  {
    text: "手写题",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/handwriting/",
      },
    ],
  },
  {
    text: "知识碎片",
    collapsible: true,
    items: [
      {
        text: "开始",
        link: "/snippets/",
      },
    ],
  },
];
