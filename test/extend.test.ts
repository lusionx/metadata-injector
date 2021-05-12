import { Inject, Provider, Module, BaseModule, ModuleFactory } from "../index";

import { Acl } from "./mods";

@Provider()
export class Ah extends Acl {
  say() {
    return "say Ah";
  }
}

@Provider()
export class C2 {
  constructor(public ac: Acl) {}

  @Inject(Ah)
  ah!: Acl;

  hello() {
    return [this.ah.say()];
  }
}

@Module({
  controllers: [C2],
  tops: [Ah],
})
export class A3Module extends BaseModule {}

describe("c deps", () => {
  it("c has ah", () => {
    const app = ModuleFactory.create(A3Module);
    const ins = app.get(C2);
    expect(ins.ah).toBeTruthy();
    expect(ins.hello()).toEqual(["say Ah"]);
  });
});

@Provider()
export class Ax {
  say() {
    return "say Ah";
  }
}

@Provider()
export class Cx {
  constructor(public ac: Acl) {}

  @Inject(Ax)
  ah!: Acl;

  hello() {
    return [this.ah.say()];
  }
}

@Module({
  controllers: [Cx],
  tops: [Ax],
})
export class AxModule extends BaseModule {}

describe("c deps err", () => {
  it("ax not Acl", () => {
    expect(() => ModuleFactory.create(AxModule)).toThrow();
  });
});
