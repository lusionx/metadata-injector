import * as consts from "./consts";
import * as util from "util";
import { Type, ModuleOpt } from "./interfaces";

import "reflect-metadata";

export function Provider(options?: { id?: string }): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(consts.meta.svc, options, target);
  };
}

/**
 * 注入属性, 默认情况下请直接使用 new 参数注入
 * 只有解决循环依赖/子类实现时才使用属性注入
 * @param id 指向熟悉 type 的子类, 实现替换
 * @returns
 */
export function Inject(id?: Type): PropertyDecorator {
  return (target: Object, key: string | symbol) => {
    const k = util.format(consts.meta.property, key);
    Reflect.defineMetadata(k, { id, key }, target); // target 指向 class.prototype
  };
}

/**
 * 依赖树容器
 * @param options
 * @returns
 */
export function Module(options: ModuleOpt): ClassDecorator {
  return (mod) => {
    Reflect.defineMetadata(consts.meta.ctx, options, mod);
  };
}
