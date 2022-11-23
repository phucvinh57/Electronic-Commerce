import { ID_LENGTH } from "@constants";
import { UpdateCartItemDto } from "@dtos/in";
import { CartItemDto } from "@dtos/out";
import { CartService } from "@services";
import { Controller, Inject } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { BodyParams, PathParams, Session } from "@tsed/platform-params";
import {
    Delete,
    Description,
    Get,
    MaxLength,
    MinLength,
    MinProperties,
    Post,
    Put,
    Required,
    Returns
} from "@tsed/schema";
import { SessionContainer } from "supertokens-node/recipe/session";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

@Controller("/cart")
@UseBefore(verifySession())
export class CartController {
    @Inject()
    private cartService: CartService;

    @Get("/")
    @Description("Get cart items")
    @Returns(200, Array).Of(CartItemDto)
    async getCartItems(@Session() session: SessionContainer): Promise<CartItemDto[]> {
        return this.cartService.getItems(session.getUserId());
    }

    @Post("/")
    @Description("Add an item to cart")
    @Returns(200, String)
    async addToCart(
        @Required()
        @BodyParams("productId")
        @MinLength(ID_LENGTH)
        @MaxLength(ID_LENGTH)
        @Description("Product ID")
        productId: string,

        @Session() session: SessionContainer
    ): Promise<string> {
        return this.cartService.addItem(session.getUserId(), productId);
    }

    @Delete("/:id")
    @Description("Delete cart item")
    @Returns(200, String)
    async removeFromCart(
        @PathParams("id")
        @MinLength(ID_LENGTH)
        @MaxLength(ID_LENGTH)
        @Required()
        @Description("Cart item ID")
        cartItemId: string
    ): Promise<string> {
        return this.cartService.removeItem(cartItemId);
    }

    @Put("/")
    @Description("Update cart item")
    @Returns(200, String)
    async updateItem(
        @BodyParams()
        @MinProperties(2)
        payload: UpdateCartItemDto
    ): Promise<string> {
        return this.cartService.updateItem(payload);
    }
}
