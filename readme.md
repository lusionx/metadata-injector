metadata-injector
=================================

仿 nestjs 的核心逻辑, 利用元数据, 自动构建依赖

### 什么是元数据

元数据通过`decorator`设置, 所以只能在`class`上生效

元数据是一种类似静态熟悉, 附在类上信息数据, 使用 api

```js
Reflect.defineMetadata(k, v, target);
Reflect.getMetadata(k, target);
Reflect.getMetadata("design:paramtypes", target);
```

如果对属性, 则附在 target.prototype 上
```js
Reflect.defineMetadata(k, v, target); // tagget 是 prototype
Reflect.getMetadata(k, target.prototype, protoKey);
Reflect.getMetadata("design:type", target.prototype, protoKey);
```

`k`完全自定义, 但有如下约定的值本 ts 利用,
- design:paramtypes 参数类型 [type]
- design:type 属性类型 `type`

使用任意装饰器时, ts 会生成对应的 design 值, 不用手动设置

### 原理
使用 map 维护依赖, 特别的之处在于利用 class 自身做 key, 而不必转化成 string

> 缺点是无法通过文本配置多态

### 概念
万物都是 service, 在 constructor 里指定需要的依赖, 并完成自身构建

SvcModuel 容器承载整个 svc 树, 使用 @Module 指定构建入口

使用属性注入解决循环依赖的问题, 如果 init 时需要注入的熟悉, 需要再实现 OnModuleInit 接口

> 尽可能只用 new 参数完成依赖声明
> 缺少 asyncInit 机制, 目前不希望引用
