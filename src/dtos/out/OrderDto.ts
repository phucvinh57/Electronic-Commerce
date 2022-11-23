import { OrderItemModel, OrderModel, ProductSize } from "@tsed/prisma";
import { CollectionOf, Enum, Example, Name, Nullable, Property } from "@tsed/schema";

class OrderItem {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    coverImageUrl: string;

    @Example("Rick & Morty T-Shirt")
    name: string;

    @Example("Lorem ispum ....")
    @Nullable(String)
    summary: string | null;

    @Example(15)
    price: number;

    @Example(3)
    quantity: number;

    @Enum(ProductSize)
    size: ProductSize;

    @Example("#343a40")
    color: string;

    constructor(item: OrderItemModel) {
        this.id = item.id;
        this.coverImageUrl = item.coverImageUrl;
        this.name = item.name;
        this.summary = item.summary;
        this.price = item.price;
        this.quantity = item.quantity;
        this.size = item.size;
        this.color = item.color;
    }
}

export class OrderDto {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Property(Date)
    date: Date;

    @Example(12)
    price: number;

    @Example(0)
    discount: number;

    @CollectionOf(OrderItem)
    items: OrderItem[];

    @Example("AS5WQ9")
    @Name("order_code_ghn")
    orderCodeGHN: string;

    @Example(12)
    @Name("ship_cost")
    shippingFee: number;

    constructor(order: OrderModel) {
        this.id = order.id;
        this.date = order.createdAt;
        this.price = order.price;
        this.discount = order.discount;
        this.orderCodeGHN = order.orderCodeGHN;
        this.shippingFee = order.shippingFee;

        this.items = order.items.map((item) => new OrderItem(item));
    }
}
