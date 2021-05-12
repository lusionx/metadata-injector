import { ModuleFactory } from "../index";
import { A1Module, A2Module, Bcl, Ccl } from "./mods";

describe("b dep a", () => {
  it("b of a", () => {
    const app = ModuleFactory.create(A1Module);
    const ins = app.get(Bcl);
    expect(ins).toBeTruthy();
    expect(ins.ac).toBeTruthy();
  });

  it("call b.a", () => {
    const app = ModuleFactory.create(A1Module);
    const ins = app.get(Bcl);
    expect(ins.ac.say()).toEqual("say");
  });
});

describe("c deps", () => {
  it("c of a", () => {
    const app = ModuleFactory.create(A2Module);
    const ins = app.get(Ccl);
    expect(ins).toBeTruthy();
    expect(ins.ac).toBeTruthy();
    expect(ins.ac.say()).toEqual("say");
  });

  it("c has 2 b", () => {
    const app = ModuleFactory.create(A2Module);
    const ins = app.get(Ccl);
    expect(ins.b1).toBeTruthy();
    expect(ins.b2).toBeTruthy();
    expect(ins.hello()).toEqual(["hello", "hello"]);
  });
});
