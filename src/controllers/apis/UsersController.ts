import { Controller, Inject } from "@tsed/di";
import { Get } from "@tsed/schema";

@Controller("/hello-world")
export class HelloWorldController {
    @Inject()
    @Get("/")
    async get() {
        // TODO
    }
}
