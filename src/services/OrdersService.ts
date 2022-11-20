import { SHIPPING_FEE } from "@constants";
import { CreateOrderDto } from "@dtos/in";
import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { CartItemsRepository, OrdersRepository } from "@tsed/prisma";

@Injectable()
export class OrdersService {
    @Inject()
    private ordersRepository: OrdersRepository;

    @Inject()
    private cartItemsRepository: CartItemsRepository;

    async createOrder(userId: string, payload: CreateOrderDto): Promise<string> {
        const userCartItems = await this.cartItemsRepository.findMany({
            select: {
                quantity: true,
                size: true,
                color: true,
                product: true
            },
            where: { userId: userId }
        });
        if (userCartItems.length === 0) throw new BadRequest("Empty cart !");

        let totalPrice = 0;
        let totalDiscount = 0;
        const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];
        userCartItems.forEach((item) => {
            totalPrice += item.product.price;
            if (item.product.discount) totalDiscount += item.product.discount;
            orderItems.push({
                name: item.product.name,
                summary: item.product.summary,
                description: item.product.description,
                coverImageUrl: item.product.coverImageUrl,
                price: item.product.price,
                discount: item.product.discount,
                color: item.color,
                size: item.size
            });
        });

        const order = await this.ordersRepository.create({
            data: {
                address: payload.address,
                phone: payload.phone,
                shippingFee: SHIPPING_FEE,
                paymentMethod: payload.paymentMethod,
                userId: userId,
                price: totalPrice,
                discount: totalDiscount,
                items: {
                    createMany: {
                        data: orderItems
                    }
                }
            }
        });
        return order.id;
    }
}
