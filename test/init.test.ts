import { Provider, Module, BaseModule, ModuleFactory } from "../index";

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
  hello() {
    this.ac.say();
    console.log("hello Bcl");
  }
}

@Module({
  controllers: [Bcl],
})
class AppModule extends BaseModule {}

function main() {
  const app = ModuleFactory.create(AppModule);
  const ct = app.get(Bcl);
  ct.hello();
}

process.nextTick(main);
