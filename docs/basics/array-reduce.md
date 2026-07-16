# 一个 reduce 搞定数组五连问

`reduce` 是数组方法里的瑞士军刀——看起来只是"累加器"，实际上能干的事远超你想象。下面用五道经典题串一遍。

## 1. 累加数组

```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 10
```

这是 reduce 的"本行"——把数组归约成一个值。第二个参数 `0` 是初始值，不传的话会用数组第一个元素作为初始值。

## 2. 找最大值

```javascript
const arr = [1, 5, 2, 8, 3];
const max = arr.reduce((pre, cur) => Math.max(pre, cur));
console.log(max); // 8
```

当然，实际项目里用 `Math.max(...arr)` 更直接。但这个例子展示了 reduce 的核心思想——每一步都在"累积"一个计算结果。

## 3. 数组去重

```javascript
const arr = [1, 2, 2, 4, 5];
const unique = arr.reduce((list, cur) => {
  if (!list.includes(cur)) list.push(cur);
  return list;
}, []);
console.log(unique); // [1, 2, 4, 5]
```

这写法比 `[...new Set(arr)]` 啰嗦不少，但胜在可控——你可以在去重的同时做其他处理。实际开发中去重还是优先用 `Set`，简单高效。

## 4. 字符串反转

```javascript
const str = 'angel';
const reversed = [...str].reduce((pre, cur) => cur + pre, '');
console.log(reversed); // 'legna'
```

可以理解为"每次把当前字符放到已累积结果的前面"。虽然 `str.split('').reverse().join('')` 更直白，但 reduce 的写法能让你理解它的运行逻辑。

## 5. 归类（group by）

```javascript
const users = [
  { name: 'Alice', country: 'China' },
  { name: 'Bob', country: 'China' },
  { name: 'Charlie', country: 'USA' },
  { name: 'David', country: 'UK' },
];

const grouped = users.reduce((map, user) => {
  const { country } = user;
  if (!map[country]) map[country] = [];
  map[country].push(user);
  return map;
}, {});
```

这是 reduce 最实用的场景——把数组按某个字段分组。前端经常用这招处理接口返回的列表数据，比如按分类、按日期组织数据。

## 总结

reduce 本质上就是"遍历 + 累积"，初始值可以是数字、数组、对象……几乎任何东西。别被它的"累加器"名字限制住思维——它是个通用的归约工具。
