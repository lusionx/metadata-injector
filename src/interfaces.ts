export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

interface Typ0<T = any> extends Function {
  new (): T;
}

export interface ModuleOpt {
  /**
   * 构建入口, new 签名必须有参数
   */
  controllers: Type[];

  /**
   * 特例入口, new 签名0参数
   */
  tops?: Typ0[];
}

export interface OnModuleInit {
  /**
   * new / 注入熟悉 之后调用
   * 解决 init 中依赖被注入的属性的问题
   */
  onModuleInit(): void;
}
