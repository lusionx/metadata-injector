export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}


export interface ModuleOpt {
    controllers: Type[];
}
