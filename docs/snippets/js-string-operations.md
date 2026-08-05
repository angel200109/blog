# JS 字符串常用操作

### startsWith 与 indexOf 的定位差异

`String.prototype.startsWith` 和 `String.prototype.indexOf` 都支持从指定位置开始搜索，但它们的返回值和语义完全不同。

`startsWith` 判断字符串是否以某个子串开头，返回布尔值。第二个参数 `position` 指定从哪个索引位置开始判定"开头"：

```javascript
const filePath = "/static/images/avatar.png";

filePath.startsWith("/static");       // true
filePath.startsWith("/images", 8);    // true，从索引 8 开始判定
```

`indexOf` 返回子串首次出现的位置索引，未找到则返回 `-1`。第二个参数同样指定起始搜索位置：

```javascript
const url = "https://api.example.com/v1/users";

url.indexOf("api");            // 8
url.indexOf("v2");             // -1
url.indexOf("e", 10);          // 18，从索引 10 开始搜索第一个 "e"
```

选择哪个方法取决于意图：判断"是否以某子串开头"用 `startsWith` 语义更明确；需要知道子串的确切位置时用 `indexOf`。

### trim 清除首尾空格

`String.prototype.trim` 移除字符串开头和结尾的空白字符（空格、制表符、换行符等），返回新字符串，不修改原值。

```javascript
const rawInput = "   angel@example.com   ";
const email = rawInput.trim();
console.log(email);  // "angel@example.com"
```

表单输入场景中，在提交前对用户输入执行 `trim` 是常见做法。需要注意 `trim` 不会移除字符串中间的空格，如果需要清理内部空白，需要配合 `replace` 或 `split` + `filter` 处理。

`trimStart`（别名 `trimLeft`）和 `trimEnd`（别名 `trimRight`）可以只处理一侧的空白：

```javascript
const indent = "    import { ref } from 'vue';";
indent.trimStart();  // "import { ref } from 'vue';"
```

### 字符串转数字的三种途径

JavaScript 提供了多种将字符串转为数字的方式，各自的容错机制和返回行为有所不同。

`Number()` 对格式要求严格，遇到非数字字符直接返回 `NaN`：

```javascript
Number("42");        // 42
Number("3.14");      // 3.14
Number("42px");      // NaN
Number("");          // 0
```

`parseInt` 和 `parseFloat` 按从左到右的顺序解析，遇到第一个非数字字符时停止，返回已解析的部分：

```javascript
parseInt("42px");     // 42
parseInt("3.14");     // 3 —— parseInt 不识别小数点
parseFloat("3.14");   // 3.14
parseFloat("3.14rem");// 3.14
parseInt("abc");      // NaN
```

`parseInt` 还支持第二个参数指定进制：

```javascript
parseInt("FF", 16);   // 255
parseInt("1010", 2);  // 10
```

在 CSS 工具函数中，`parseFloat` 常用于从带单位的字符串中提取数值；而表单字段的整数校验场景则更适合用 `Number()` 配合 `isNaN` 做严格检查。
