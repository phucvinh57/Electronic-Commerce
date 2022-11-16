import { Controller, Inject } from "@tsed/di";
import { HelloWorldsRepository } from "@tsed/prisma";
import { Get, Post } from "@tsed/schema";

@Controller("/hello-world")
export class HelloWorldController {
  @Inject()
  private helloRepo: HelloWorldsRepository

  @Get("/")
  async get() {
    let a;
    return this.helloRepo.findMany();
  }

}
