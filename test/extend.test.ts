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
  it("c of a", () => {
    const app = ModuleFactory.create(A3Module);
    const ins = app.get(C2);
    expect(ins).toBeTruthy();
    expect(ins.ac).toBeTruthy();
    expect(ins.ac.say()).toEqual("say");
  });

  it("c has ah", () => {
    const app = ModuleFactory.create(A3Module);
    const ins = app.get(C2);
    expect(ins.ah).toBeTruthy();
    expect(ins.hello()).toEqual(["say Ah"]);
  });
});
