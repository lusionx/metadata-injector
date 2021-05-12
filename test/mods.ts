import { Inject, Provider, Module, BaseModule } from "../index";

@Provider()
export class Acl {
  say() {
    return "say";
  }
}

@Provider()
export class Bcl {
  constructor(public ac: Acl) {}
  hello() {
    return "hello";
  }
}

@Provider()
export class Ccl {
  constructor(public ac: Acl) {}

  @Inject()
  b1!: Bcl;

  @Inject()
  b2!: Bcl;

  hello() {
    return [this.b1.hello(), this.b2.hello()];
  }
}

@Module({
  controllers: [Bcl],
})
export class A1Module extends BaseModule {}

@Module({
  controllers: [Ccl, Bcl],
})
export class A2Module extends BaseModule {}
