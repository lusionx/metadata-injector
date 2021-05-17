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

function cLoop<T>(ctrs: Set<Type<T>>, modMap: ModFnMap<T>): boolean {
  let op = false;
  const nst = new Set<Type<T>>();
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
      // 参数缺实例
      types.forEach((e) => nst.add(e));
      op = true;
    }
  }

  // 填入待 new
  nst.forEach((e) => ctrs.add(e));

  return op;
}

function rCreate<T>(ctrs: Set<Type<T>>, modMap: ModFnMap<T>): void {
  let cc = ctrs.size;
  const ops: boolean[] = [true, true];
  while (cc) {
    const op = cLoop(ctrs, modMap);
    ops.push(op);
    const [a, b] = ops.slice(-2);
    if (a === false && b === false) {
      break;
    }
  }

  if (ctrs.size === modMap.size) return;
  // 遍历完成
  const ctr = [...ctrs].find((e) => !modMap.get(e));
  if (ctr) {
    const types: Type<T>[] = Reflect.getMetadata(consts.design.paramtypes, ctr);
    const params = types.map((e) => modMap.get(e)).filter((e) => e);
    const names = types.map((e) => e.name).join("/");
    const str = `[class ${ctr.name}] types: [class ${names}] has ${params}`;
    throw new Error(str);
  }
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
