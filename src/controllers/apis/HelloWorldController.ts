import { Controller, Inject } from "@tsed/di";
import { HelloWorldsRepository } from "@tsed/prisma";
import { Get } from "@tsed/schema";

@Controller("/hello-world")
export class HelloWorldController {
    @Inject()
    private helloRepo: HelloWorldsRepository;

    @Get("/")
    async get() {
        return this.helloRepo.findMany();
    }
}
