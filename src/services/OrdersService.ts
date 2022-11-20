import { FAVOUR, SHIPPING_FEE } from "@constants";
import { CreateOrderDto } from "@dtos/in";
import { OrderDto } from "@dtos/out";
import { Prisma, PrismaClient } from "@prisma/client";
import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { CartItemsRepository, OrdersRepository, OrderStatus } from "@tsed/prisma";

@Injectable()
export class OrdersService {
    @Inject()
    private ordersRepository: OrdersRepository;

    @Inject()
    private cartItemsRepository: CartItemsRepository;

    @Inject()
    private prismaClient: PrismaClient;

    async createOrder(userId: string, payload: CreateOrderDto): Promise<string> {
        if (payload.favourCode && payload.favourCode !== FAVOUR.code) {
            throw new BadRequest("Invalid favour code !");
        }
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
                size: item.size,
                quantity: item.quantity
            });
        });

        if (payload.favourCode === FAVOUR.code) {
            totalDiscount += FAVOUR.value;
        }

        const [order] = await this.prismaClient.$transaction([
            this.prismaClient.order.create({
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
            }),
            // Clean cart
            this.prismaClient.cartItem.deleteMany({
                where: { userId: userId }
            })
        ]);

        return order.id;
    }

    async getByStatus(userId: string, status?: OrderStatus): Promise<OrderDto[]> {
        const orders = await this.ordersRepository.findMany({
            include: {
                items: true
            },
            where: {
                userId: userId,
                status: status
            }
        });
        return orders.map((order) => new OrderDto(order));
    }

    async cancelOrder(orderId: string): Promise<string> {
        await this.ordersRepository.update({
            data: {
                status: OrderStatus.CANCELED
            },
            where: { id: orderId }
        });
        return orderId;
    }
}
