import * as consts from "./consts";
import * as util from "util";
import { Type } from "./interfaces";

import "reflect-metadata";

export function Provider(options?: { id?: string }): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(consts.meta.svc, options, target);
  };
}

export function Inject(id?: string): PropertyDecorator {
  return (target: Object, key: string | symbol) => {
    const k = util.format(consts.meta.property, key);
    Reflect.defineMetadata(k, { id, key }, target);
  };
}

interface ModuleOpt {
  controllers: Type[];
}

export function Module(options: ModuleOpt): ClassDecorator {
  return (mod) => {
    Reflect.defineMetadata(consts.meta.ctx, options, mod);
  };
}
