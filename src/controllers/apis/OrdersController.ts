import { CreateOrderDto } from "@dtos/in";
import { Controller, Inject } from "@tsed/di";
import { BodyParams, Session } from "@tsed/platform-params";
import { Description, Post, Returns } from "@tsed/schema";
import { OrdersService } from "@services";
import { SessionContainer } from "supertokens-node/recipe/session";

@Controller("/orders")
export class OrdersController {
    @Inject()
    private ordersService: OrdersService;

    @Post("/")
    @Returns(200, String).Description("Order's ID")
    @Description("Create order")
    async createOrder(
        @BodyParams() payload: CreateOrderDto,
        @Session() session: SessionContainer
    ): Promise<string> {
        return this.ordersService.createOrder(session.getUserId(), payload);
    }
}
