# 原生对象、内置对象、宿主对象

### 原生对象（Native Objects）

原生对象是由 JavaScript 语言规范（ECMAScript）定义、由 JS 引擎实现的对象。它们是语言本身的一部分，不依赖宿主环境。

常见的原生对象分为：

**值类型包装对象**：`String`、`Number`、`Boolean`、`Symbol`、`BigInt`。引擎在访问基本类型值的属性时会自动创建对应的包装对象，操作完成后立即销毁。

**基础工具对象**：`Object`、`Array`、`Function`、`Date`、`RegExp`。日常开发中直接使用的构造器。

**结构化数据**：`Map`、`Set`、`WeakMap`、`WeakSet`、`ArrayBuffer`、`DataView`、`TypedArray` 系列。

**控制抽象**：`Promise`、`Proxy`、`Reflect`、`Generator`、`AsyncFunction`。

**错误类型**：`Error`、`TypeError`、`RangeError`、`SyntaxError`、`ReferenceError` 等。

这些对象的规范和最小接口由 ECMAScript 标准定义，所有兼容的 JS 引擎都必须提供。

### 内置对象（Built-in Objects）

内置对象是原生对象的子集——那些在引擎启动时就已经实例化并挂载在全局作用域上的对象。开发者不需要自己创建，可以直接使用：

```js
Math.PI; // 3.14159... —— 内置单例
Math.max(1, 2, 3); // 3

JSON.stringify({ a: 1 }); // '{"a":1}'
JSON.parse('{"a":1}'); // { a: 1 }

console.log('debug info');
```

主要的内置对象包括：
- **`Math`**：数学常量和函数，没有构造函数，所有方法都是静态的。
- **`JSON`**：序列化和反序列化工具。
- **`console`**：调试输出接口（严格来说是宿主对象，但在 Node.js 和浏览器中普遍可用）。
- **`Reflect`**：对象操作的反射 API。
- **`Atomics`**：共享内存的原子操作（与 `SharedArrayBuffer` 配合使用）。

`Math` 和 `JSON` 是纯内置对象——它们不是函数，不能用 `new` 调用。`Reflect` 的设计意图是将原本散落在 `Object` 上的底层操作集中起来，并提供更一致的返回值（比如 `Reflect.defineProperty` 返回布尔值而非抛出异常）。

### 宿主对象（Host Objects）

宿主对象由 JavaScript 的运行环境提供，不属于 ECMAScript 规范。不同环境下的宿主对象完全不同。

**浏览器环境**：

```js
window; // 全局对象
document; // DOM 文档根节点
document.querySelector('.header'); // DOM 查询
localStorage.setItem('key', 'value'); // 本地存储
fetch('/api/data'); // 网络请求
```

浏览器的宿主对象主要包括：`window`、`document`、`location`、`navigator`、`history`、`localStorage`、`sessionStorage`、`XMLHttpRequest`、`fetch`、`WebSocket`、`Worker`，以及所有 DOM API 返回的节点对象。

**Node.js 环境**：

```js
process.env.NODE_ENV; // 进程环境变量
fs.readFileSync('/path/to/file'); // 文件系统
path.join('a', 'b', 'c'); // 路径处理
http.createServer((req, res) => {}); // HTTP 服务
Buffer.from('hello'); // 二进制缓冲
```

Node.js 的宿主对象包括：`process`、`Buffer`、`require`、`module`、`__dirname`、`__filename`，以及 `fs`、`path`、`http` 等内置模块暴露的 API。

### 三种对象的关系

```js
// 原生对象，也是内置对象（引擎启动时已挂载到全局）
Object
Array
Promise

// 原生对象，但不是内置对象（需要自己实例化或从其他 API 获取）
new Map()
new Set()

// 不是原生对象，是内置对象（不属于 ECMAScript 规范，但引擎启动即存在）
Math
JSON
console // 严格来说在浏览器中属于宿主对象

// 宿主对象（由环境提供）
document // 浏览器
process // Node.js
```

### 交叉与边界

有些对象在不同分类之间有明显交叉。`setTimeout` 和 `setInterval` 在浏览器中属于宿主对象（由 `window` 提供），在 Node.js 中虽然返回相同类型的 ID，但实现和行为有细微差异。`console` 虽然在任何环境中都可用，但它并不在 ECMAScript 规范中——浏览器通过宿主环境提供，Node.js 通过其核心模块模拟。

区分这三类对象的实际意义在于：调试时能更快定位问题来源——是语言本身的 bug，还是特定环境的 API 使用方式不对。
