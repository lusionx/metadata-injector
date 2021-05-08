import { Provider, Module, BaseModule, ModuleFactory } from "../index";
import { Inject } from "../src/decorators";

@Provider()
class Acl {
  say() {
    console.log("Acl say");
  }
}

@Provider()
class Bcl {
  constructor(protected ac: Acl) {}
  hello() {
    this.ac.say();
    console.log("hello Bcl");
  }
}

@Provider()
class Ccl {
  constructor(public ac: Acl) {}

  @Inject()
  b1!: Bcl;

  @Inject()
  b2!: Bcl;

  hello() {
    this.ac.say();
    console.log("hello Ccl");
  }
}

@Module({
  controllers: [Ccl, Bcl],
})
class AppModule extends BaseModule {}

function main() {
  const app = ModuleFactory.create(AppModule);
  console.log(app.all())
  const ct = app.get(Ccl);
  ct.hello();
  ct.b1.hello()
}


process.nextTick(main);
