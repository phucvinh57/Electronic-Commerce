import { CreateOrderDto } from "@dtos/in";
import { Controller, Inject } from "@tsed/di";
import { BodyParams, QueryParams, Session } from "@tsed/platform-params";
import {
    Description,
    Enum,
    Get,
    MaxLength,
    MinLength,
    Post,
    Put,
    Required,
    Returns
} from "@tsed/schema";
import { OrdersService } from "@services";
import { SessionContainer } from "supertokens-node/recipe/session";
import { OrderStatus } from "@tsed/prisma";
import { OrderDto } from "@dtos/out";
import { ID_LENGTH } from "@constants";

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

    @Get("/")
    @Returns(200, Array).Of(OrderDto)
    @Description("Get orders by status")
    async getByStatus(
        @Session() session: SessionContainer,

        @QueryParams("status")
        @Enum(OrderStatus)
        status?: OrderStatus
    ): Promise<OrderDto[]> {
        return this.ordersService.getByStatus(session.getUserId(), status);
    }

    @Put("/cancel")
    @Returns(200, String)
    @Description("Cancel an order")
    async cancelOrder(
        @BodyParams("orderId")
        @Required()
        @MinLength(ID_LENGTH)
        @MaxLength(ID_LENGTH)
        orderId: string
    ): Promise<string> {
        return this.ordersService.cancelOrder(orderId);
    }
}
