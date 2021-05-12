import { Inject, Provider, Module, SvcModule } from "../index";
import { OnModuleInit } from "../src/interfaces";

@Provider()
export class Acl {
  say() {
    return "say";
  }
}

@Provider()
export class Bcl implements OnModuleInit {
  init: boolean;
  constructor(public ac: Acl) {
    this.init = false;
  }
  onModuleInit(): void {
    this.init = true;
  }
  hello() {
    return "hello";
  }
}

@Module({
  controllers: [Bcl],
})
export class A1Module extends SvcModule {}

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
  controllers: [Ccl, Bcl],
})
export class A2Module extends SvcModule {}
