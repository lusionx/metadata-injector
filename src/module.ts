import * as consts from "./consts";
import { ModuleOpt, Type } from "./interfaces";

export class BaseModule {
    private modMap!: Map<any, any>;
    get<TInput = any, TResult = TInput>(svc: Type<TInput>): TResult {
        return this.modMap.get(svc);
    }
}

export class ModuleFactory {
    static create<TInput = any, TRes = TInput>(mod: Type<TInput>): TRes {
        const modOPt: ModuleOpt = Reflect.getMetadata(consts.mate.ctx, mod);
        const moe: any = new BaseModule();
        const modMap = new Map<Type<TInput>, any>();

        const loop = (ctrs: any[]) => {
            for (const ctr of ctrs) {
                const types: [] = Reflect.getMetadata(
                    consts.design.paramtypes,
                    ctr,
                );
                if (types) {
                    const params = types
                        .map((e) => modMap.get(e))
                        .filter((e) => e);
                    if (types.length === params.length) {
                        modMap.set(ctr, new ctr(...params));
                    }
                } else {
                    modMap.set(ctr, new ctr());
                }
            }
        };

        for (const ctr of modOPt.controllers) {
            const params: [] = Reflect.getMetadata(
                consts.design.paramtypes,
                ctr,
            );

            if (params) {
                loop(params);
                modMap.set(ctr, new ctr(...params.map((e) => modMap.get(e))));
            } else {
                modMap.set(ctr, new ctr());
            }
        }
        console.log(modMap);
        Object.assign(moe, { modMap });
        return moe;
    }
}
