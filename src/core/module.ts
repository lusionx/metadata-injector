import * as consts from "./consts";
import { strictEqual } from "assert";
import { ModuleOpt, OnModuleInit, Type } from "./interfaces";

export class SvcModule {
  private modMap!: ModFnMap<any>;
  get<TInput = any, TResult = TInput>(svc: Type<TInput>): TResult {
    return this.modMap.get(svc);
  }

  all() {
    return this.modMap;
  }
}

type ModFnMap<T> = Map<Type<T>, T>;

function rCreate<T>(ctrs: Set<Type<T>>, modMap: ModFnMap<T>): boolean {
  let op = false;
  for (const ctr of ctrs) {
    if (modMap.get(ctr)) continue; // 已经实例化
    const types: Type<T>[] = Reflect.getMetadata(consts.design.paramtypes, ctr);

    if (!types) {
      // 无依赖
      modMap.set(ctr, new ctr());
      op = true;
      continue;
    }

    let params = types.map((e) => modMap.get(e)).filter((e) => e);
    if (types.length === params.length) {
      // 参数已经实例化
      modMap.set(ctr, Reflect.construct(ctr, params));
      op = true;
    } else {
      op = rCreate(new Set(types), modMap);
      params = types.map((e) => modMap.get(e)).filter((e) => e);
      if (types.length !== params.length) {
        const names = types.map((e) => e.name).join("/");
        throw new Error(
          `[class ${ctr.name}] types: [class ${names}] has ${params}`,
        );
      }
      modMap.set(ctr, Reflect.construct(ctr, params));
    }
  }
  return op;
}

/**
 * 构造完成后将属性注入
 * @param modMap
 */
function injectProperty<T>(modMap: ModFnMap<T>) {
  for (const [ctr, inst] of modMap) {
    const pkeys = Reflect.getMetadataKeys(ctr.prototype) || [];
    for (const pk of pkeys) {
      type tAttr = { key: string; id?: Type };
      const pAttr: tAttr = Reflect.getMetadata(pk, ctr.prototype);
      const ptype = Reflect.getMetadata(
        consts.design.type,
        ctr.prototype,
        pAttr.key,
      );
      if (pAttr.id) {
        strictEqual(
          pAttr.id.prototype.__proto__,
          ptype.prototype,
          `[class ${pAttr.id.name}] not extends [class ${ptype.name}]`,
        );
      }
      Object.assign(inst, { [pAttr.key]: modMap.get(pAttr.id || ptype) });
    }
  }
}

function execInit<T>(modMap: Map<Type<T>, Partial<OnModuleInit>>) {
  for (const [, inst] of modMap) {
    if (inst.onModuleInit) {
      inst.onModuleInit();
    }
  }
}

export class ModuleFactory {
  static create<TInput = any, TRes = TInput>(mod: Type<TInput>): TRes {
    const modOPt: ModuleOpt = Reflect.getMetadata(consts.meta.ctx, mod);
    const moe: any = new SvcModule();
    const modMap = new Map<Type<TInput>, any>();

    const ends = new Set<Type<TInput>>();
    if (modOPt.tops) {
      for (const ctr of modOPt.tops) {
        modMap.set(ctr, new ctr());
      }
    }
    for (const ctr of modOPt.controllers) {
      const params: [] = Reflect.getMetadata(consts.design.paramtypes, ctr);
      if (!params) throw new Error(`[class ${ctr.name}] miss @Provider`);
      if (params.length) {
        // 有依赖 等轮
        ends.add(ctr);
      } else {
        // controller 本身是无依赖的情况
        modMap.set(ctr, new ctr());
      }
    }

    rCreate(ends, modMap);
    injectProperty(modMap);
    execInit(modMap);

    Object.assign(moe, { modMap });
    return moe;
  }
}