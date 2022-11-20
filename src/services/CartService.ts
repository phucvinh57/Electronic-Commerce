import { UpdateCartItemDto } from "@dtos/in";
import { CartItemDto } from "@dtos/out";
import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@tsed/di";
import { ResourceNotFound } from "@tsed/platform-exceptions";
import { CartItemsRepository, ProductTypesRepository } from "@tsed/prisma";

@Injectable()
export class CartService {
    @Inject()
    private cartItemsRepository: CartItemsRepository;

    @Inject()
    private productTypesRepository: ProductTypesRepository;

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

    async addItem(userId: string, productId: string): Promise<string> {
        const productDefaultType = await this.productTypesRepository.findFirst({
            where: {
                productId
            }
        });

        if (!productDefaultType) throw new ResourceNotFound("Product does not have type !");
        const item = await this.cartItemsRepository.create({
            data: {
                productId,
                userId,
                color: productDefaultType.color,
                size: productDefaultType.size
            }
        });
        return item.id;
    }

    async removeItem(itemId: string): Promise<string> {
        await this.cartItemsRepository.delete({
            where: { id: itemId }
        });
        return itemId;
    }

    async updateItem(payload: UpdateCartItemDto) {
        await this.cartItemsRepository.update({
            data: {
                quantity: payload.quantity,
                color: payload.color,
                size: payload.size
            },
            where: { id: payload.itemId }
        });

        return payload.itemId;
    }
}
