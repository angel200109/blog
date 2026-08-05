# JS 堆栈内存与参数传递

### 基础类型与引用类型在内存中的分布

JavaScript 的内存模型将数据分为两类存放：基础类型（Primitive）的值直接存储在栈（Stack）中，引用类型（Reference）的值存储在堆（Heap）中，栈中仅保存指向堆内存的引用地址。

栈内存由系统自动分配和回收，存取速度快但空间有限，适合存放大小固定、生命周期可预测的基础类型值。堆内存空间更大，由垃圾回收器管理，适合存放大小不确定、需要动态扩展的引用类型数据。

```javascript
let count = 42;                // count 的值 42 直接存在栈中
let userName = "angel";        // userName 的值 "angel" 存在栈中

let userProfile = {            // userProfile 存储的是堆内存地址
  name: "angel",
  role: "developer"
};
```

### 参数传递的本质：值传递

JavaScript 中函数的参数传递是**按值传递**的——形参接收的是实参值的副本。对基础类型而言，副本就是值本身；对引用类型而言，副本是引用地址的拷贝。

基础类型传参时，函数内部修改形参不会影响外部变量：

```javascript
function increment(num) {
  num = num + 1;
  console.log(num);   // 11
}

let points = 10;
increment(points);
console.log(points);   // 10 —— 外部变量不变
```

引用类型传参时，形参拿到的是地址的拷贝。通过这个地址修改对象属性会影响原对象，但如果让形参指向新对象，则不会影响外部变量：

```javascript
function updateProfile(profile) {
  profile.role = "admin";          // 修改的是同一个堆内存中的对象
}

function replaceProfile(profile) {
  profile = { name: "newUser" };   // 形参指向了新对象，外部不受影响
}

const user = { name: "angel", role: "developer" };

updateProfile(user);
console.log(user.role);   // "admin" —— 外部对象被修改

replaceProfile(user);
console.log(user.name);   // "angel" —— 外部变量仍指向原对象
```

### 一个经典的内存分析题

分析以下代码的输出：

```javascript
function fn(obj) {
  obj = { count: 50 };
}

const data = { count: 30 };
fn(data);
console.log(data.count);   // 30
```

执行流程：
1. `data` 存储的是 `{ count: 30 }` 在堆中的地址
2. 调用 `fn(data)` 时，形参 `obj` 接收了该地址的拷贝
3. `obj = { count: 50 }` 在堆中创建了新对象，`obj` 指向新地址
4. 函数结束，`data` 仍然指向原来的 `{ count: 30 }`

核心规则：JavaScript 永远传递值的拷贝，只不过引用类型的"值"是地址。这和一个常见的误解——"对象是按引用传递的"——有本质区别。
