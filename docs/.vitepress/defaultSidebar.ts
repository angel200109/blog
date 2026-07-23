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
    ],
  },
  {
    text: "React",
    collapsible: true,
    items: [
      { text: "开始", link: "/react/" },
      { text: "Fiber", link: "/react/Fiber" },
      { text: "Hooks", link: "/react/hooks" },
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
      { text: "静态方法和实例方法", link: "/basics/static-vs-instance-methods" },
      { text: "JS 里定义函数的六种姿势", link: "/basics/function-declaration-types" },
      { text: "回调地狱是怎么来的", link: "/basics/callback-hell" },
      { text: "Promise 是什么，怎么用", link: "/basics/promise-intro" },
      { text: "async/await 语法糖", link: "/basics/async-await" },
      { text: "Promise 四个组合方法怎么选", link: "/basics/promise-combinators" },
      { text: "链式调用的原理", link: "/basics/chainable-api" },
      { text: "Promise 和 async/await 的关系", link: "/basics/promise-async-relation" },
      { text: "prototype、__proto__ 和原型链", link: "/basics/prototype-chain" },
      { text: "原型链上的方法优先级", link: "/basics/prototype-priority" },
      { text: "作用域：var/let/const 和经典 setTimeout 面试题", link: "/basics/scope-setTimeout" },
      { text: "作用域链：变量查找机制", link: "/basics/scope-chain" },
      { text: "闭包是什么，有什么用", link: "/basics/closure" },
      { text: "DOM 事件流：捕获、目标、冒泡", link: "/basics/dom-event-flow" },
      { text: "事件委托：用冒泡省掉一万个监听器", link: "/basics/event-delegation" },
      { text: "事件冒泡和阻止冒泡", link: "/basics/event-bubble-capture" },
      { text: "Attribute 和 Property 的区别", link: "/basics/attribute-vs-property" },
      { text: "DOM 结构操作：增删移查节点", link: "/basics/dom-manipulation" },
      { text: "事件三要素与绑定/解绑", link: "/basics/event-binding" },
      { text: "mouseover 和 mouseenter 的区别", link: "/basics/mouseover-vs-mouseenter" },
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
