import { CartItemModel, ProductSize } from "@tsed/prisma";
import { Enum, Example, Integer, Min, Nullable } from "@tsed/schema";

export class CartItemDto {
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

    @Integer()
    @Min(1)
    quantity: number;

    @Enum(ProductSize)
    size: ProductSize;

    @Example("#343a40")
    color: string;

    constructor(item: CartItemModel) {
        this.id = item.id;
        this.quantity = item.quantity;
        this.color = item.color;
        this.size = item.size;
        this.coverImageUrl = item.product.coverImageUrl;
        this.price = item.product.price;
        this.name = item.product.name;
        this.summary = item.product.summary;
    }
}
