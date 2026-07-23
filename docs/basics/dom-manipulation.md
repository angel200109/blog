# DOM 结构操作：增删移查节点

## 简介

操作 DOM 是前端的基本功。创建节点、插入节点、删除节点、移动节点、查找节点——这五个动作覆盖了绝大部分 DOM 操作场景。即使现在框架帮我们做了大部分事情，但知道原生 API 怎么用，调试和写工具函数时会从容很多。

## 核心概念

### 创建节点

```js
// 创建元素
const div = document.createElement('div');
div.textContent = '新节点';

// 创建文本节点（用得少）
const text = document.createTextNode('纯文本');

// 从 HTML 字符串创建（用 innerHTML 更快）
const fragment = document.createRange().createContextualFragment('<span>hello</span>');
```

### 插入节点

```js
const parent = document.querySelector('.container');
const child = document.createElement('span');

// 追加到末尾
parent.appendChild(child);

// 插入到某个子节点前面
parent.insertBefore(child, parent.firstChild);

// 更灵活的新 API
parent.append(child, '纯文本也能加');        // 末尾追加，支持多参数
parent.prepend(child);                       // 开头插入
referenceNode.before(child);                 // 插在 referenceNode 前面
referenceNode.after(child);                  // 插在 referenceNode 后面
```

推荐用 `append`/`prepend`/`before`/`after`，比 `appendChild` 和 `insertBefore` 灵活。

### 删除节点

```js
// 从父元素移除
child.parentNode.removeChild(child);

// 直接移除自己（现代写法）
child.remove();

// 清空所有子节点
parent.innerHTML = '';
// 或
parent.replaceChildren();
```

### 移动节点

DOM 里没有"移动"API，但把已存在的节点插入到新位置，它会自动从旧位置脱离——天然移动：

```js
const box = document.querySelector('#box1 .item');
document.querySelector('#box2').appendChild(box);
// box 从 box1 跑到 box2 了，不需要先删除再添加
```

### 查找节点

```js
document.getElementById('app');                // 最快，通过 ID
document.querySelector('.list > li:last-child'); // 最灵活，CSS 选择器
document.querySelectorAll('.item');             // 找全部
element.closest('.container');                  // 向上找最近的匹配祖先
element.children;                               // 子元素（不含文本节点）
element.nextElementSibling;                     // 下一个兄弟元素
```

## 实战场景

写拖拽排序时，把拖拽的元素 `appendChild` 到目标位置就行——节点会自动从原位脱离。写无限滚动时，用 `createDocumentFragment` 批量插入减少回流。这些原生 API 在框架的底层实现里随处可见。

## 总结

增删移查四个字记住：`createElement` + `append`、`remove`、直接 `appendChild` 到新位置就是移动、`querySelector` 一把梭。现代 API 比老 API 好写得多，优先用新的。
