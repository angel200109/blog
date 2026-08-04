# 原型链：JavaScript 的继承机制

### prototype 和 \_\_proto\_\_

**prototype** 是函数独有的属性。每当创建一个函数，JavaScript 引擎会自动给它添加 `prototype` 属性，指向一个对象。这个对象称为原型对象，用来存放所有实例共享的方法和属性。

**\_\_proto\_\_** 是每个对象都有的属性（通过 `Object.getPrototypeOf()` 可以规范地访问），它指向构造函数的 `prototype`。\_\_proto\_\_ 称为隐式原型，是对象通往其原型对象的"指针"。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  console.log('Hello, my name is ' + this.name);
};

const person = new Person('Alice');
console.log(person.name);             // 'Alice'
person.sayHello();                    // 'Hello, my name is Alice'

console.log(person.__proto__ === Person.prototype);          // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null);             // true
```

### 原型链的查找机制

原型链就是对象通过 \_\_proto\_\_ 一层一层向上查找属性形成的链式结构。链的顶端是 `Object.prototype`，再往上 `Object.prototype.__proto__` 为 `null`。

```javascript
function Person(name) {
  this.name = name;
  this.a = 1;
}

const person = new Person('Angel');

Person.prototype.b = 2;
console.log(person.b); // 2 ——在 prototype 上找到

Object.prototype.c = 3;
console.log(person.c); // 3 ——沿着原型链一直找到 Object.prototype

console.log(person.d); // undefined ——整条链都没有
```

查找一个属性时的路径是：实例自身 → `Person.prototype` → `Object.prototype` → `null`。任何一个环节找到就停止，走到 `null` 还没找到就返回 `undefined`。如果把这条链展开看，person 对象的内部结构大致是：

```
{
  name: 'Angel',
  a: 1,
  __proto__: Person.prototype = {
    b: 2,
    __proto__: Object.prototype = {
      c: 3,
      __proto__: null
    }
  }
}
```

### Object.create 构筑的原型链

原型链不一定要靠构造函数来建立，`Object.create()` 可以直接以任意对象为原型创建新对象：

```javascript
const person = { name: 'Angel' };

const universityMember = Object.create(person);
universityMember.school = 'GZHU';

const student = Object.create(universityMember);
student.studentNo = '2112406055';

// for...in 会遍历整个原型链
for (let key in student) {
  console.log(key); // studentNo, school, name
}

console.log(student.__proto__ === universityMember);    // true
console.log(universityMember.__proto__ === person);     // true
console.log(person.__proto__ === Object.prototype);     // true
```

`student` → `universityMember` → `person` → `Object.prototype` → `null`。`Object.create()` 的核心价值是：不依赖构造函数和 `new`，直接指定原型关系，构建更灵活的继承结构。

### Person.prototype.\_\_proto\_\_ 是什么

`Person.prototype` 本身是一个普通对象，普通对象由 `Object` 构造函数创建，因此：

```
Person.prototype.__proto__ === Object.prototype  // true
```

这是原型链能通向 `Object.prototype` 的桥梁——所有通过构造函数创建的对象实例，最终都能追溯到 `Object.prototype` 上定义的方法（`toString`、`hasOwnProperty` 等）。
