import { CartItemDto } from "@dtos/out";
import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@tsed/di";
import { CartItemsRepository } from "@tsed/prisma";

@Injectable()
export class CartService {
    @Inject()
    private cartItemsRepository: CartItemsRepository;

    private readonly getProductBriefQuery: Prisma.ProductSelect = {
        id: true,
        coverImageUrl: true,
        name: true,
        price: true,
        discount: true
    };

    async getItems(userId: string) {
        const cartItems = await this.cartItemsRepository.findMany({
            select: {
                id: true,
                quantity: true,
                size: true,
                color: true,
                product: { select: this.getProductBriefQuery }
            },
            where: { userId }
        });

        return cartItems.map((item) => new CartItemDto(item));
    }
}
