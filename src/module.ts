import * as consts from "./consts";
import { ModuleOpt, Type } from "./interfaces";

export class BaseModule {
  private modMap!: Map<any, any>;
  get<TInput = any, TResult = TInput>(svc: Type<TInput>): TResult {
    return this.modMap.get(svc);
  }

  all() {
    return this.modMap;
  }
}

type ModFnMap<TInput> = Map<Type<TInput>, unknown>;

function loop<TInput>(ctrs: Type[], modMap: ModFnMap<TInput>) {
  for (const ctr of ctrs) {
    const types: [] = Reflect.getMetadata(consts.design.paramtypes, ctr);
    if (!types) {
      modMap.set(ctr, new ctr());
      continue;
    }

    const params = types.map((e) => modMap.get(e)).filter((e) => e);
    if (types.length === params.length) {
      modMap.set(ctr, Reflect.construct(ctr, params));
    } else {
      // [todo] 等下轮
    }
  }
}

function setProperty<TInput>(modMap: ModFnMap<TInput>) {
  for (const [ctr, inst] of modMap) {
    const pkeys = Reflect.getMetadataKeys(ctr.prototype) || [];
    for (const pk of pkeys) {
      const pAttr = Reflect.getMetadata(pk, ctr.prototype);
      const ptype = Reflect.getMetadata(
        consts.design.type,
        ctr.prototype,
        pAttr.key
      );
      Object.assign(inst, { [pAttr.key]: modMap.get(ptype) });
    }
  }
}

export class ModuleFactory {
  static create<TInput = any, TRes = TInput>(mod: Type<TInput>): TRes {
    const modOPt: ModuleOpt = Reflect.getMetadata(consts.meta.ctx, mod);
    const moe: any = new BaseModule();
    const modMap = new Map<Type<TInput>, any>();

    for (const ctr of modOPt.controllers) {
      const params: [] = Reflect.getMetadata(consts.design.paramtypes, ctr);
      if (params) {
        loop(params, modMap);
        modMap.set(ctr, new ctr(...params.map((e) => modMap.get(e))));
      } else {
        modMap.set(ctr, new ctr());
      }
    }

    setProperty(modMap);
    Object.assign(moe, { modMap });
    return moe;
  }
}
