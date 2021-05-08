metadata-injector
=================================

仿 nestjs 的核心逻辑, 利用元数据, 自动构建依赖

### 什么是元数据

元数据通过`decorator`设置, 所以只能在`class`上生效

元数据是一种类似静态熟悉, 附在类上信息数据, 使用 api

```js
Reflect.defineMetadata(k, v, target);
Reflect.getMetadata(k, target);
```

如果对属性/方法, 则附在 target.prototype 上
```js
Reflect.defineMetadata(k, v, target.prototype);
Reflect.getMetadata(k, target.prototype, protoKey);
```

`k`完全自定义, 但有如下约定的值,
- design:paramtypes 参数类型
- design:type 属性类型

使用任意装饰器时, ts 会生成对应的 design 值, 不用手动设置

### 原理
使用 map 维护依赖, 特别的之处在于利用 class 自身做 key, 而不必转化成 string

### 概念
