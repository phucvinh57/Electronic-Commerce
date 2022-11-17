import { CartItemDto } from "@dtos/out";
import { CartService } from "@services";
import { Controller, Inject } from "@tsed/di";
import { Session } from "@tsed/platform-params";
import { Description, Get, Returns } from "@tsed/schema";
import { SessionContainer } from "supertokens-node/recipe/session";

@Controller("/cart")
export class CartController {
    @Inject()
    private cartService: CartService;

    @Get("/")
    @Description("Get cart items")
    @Returns(200, Array).Of(CartItemDto)
    async getCartItems(@Session() session: SessionContainer): Promise<CartItemDto[]> {
        return this.cartService.getItems(session.getUserId());
    }
}
