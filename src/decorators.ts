import * as consts from "./consts";
import * as util from "util";
import { Type } from "./interfaces";

import "reflect-metadata";

export function Provider(options?: { id?: string }): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(consts.mate.svc, options, target);
  };
}

export function Inject(id: string): ParameterDecorator {
  return (target: Object, key: string | symbol, index: number) => {
    Reflect.defineMetadata(
      util.format(consts.mate.par, index),
      { id },
      target.constructor,
      key
    );
  };
}

interface ModuleOpt {
  controllers: Type[];
}

export function Module(options: ModuleOpt): ClassDecorator {
  return (mod) => {
    Reflect.defineMetadata(consts.mate.ctx, options, mod);
  };
}
