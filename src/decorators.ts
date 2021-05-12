import * as consts from "./consts";
import * as util from "util";
import { Type, ModuleOpt } from "./interfaces";

import "reflect-metadata";

export function Provider(options?: { id?: string }): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(consts.meta.svc, options, target);
  };
}

export function Inject(id?: Type): PropertyDecorator {
  return (target: Object, key: string | symbol) => {
    const k = util.format(consts.meta.property, key);
    Reflect.defineMetadata(k, { id, key }, target); // target 指向 class.prototype
  };
}

export function Module(options: ModuleOpt): ClassDecorator {
  return (mod) => {
    Reflect.defineMetadata(consts.meta.ctx, options, mod);
  };
}
