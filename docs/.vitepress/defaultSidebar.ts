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
