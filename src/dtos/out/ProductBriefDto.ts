import { ProductModel } from "@tsed/prisma";
import { Description, Example } from "@tsed/schema";

export class ProductBriefDto {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    coverImageUrl: string;

    @Example("Rick & Morty T-Shirt")
    name: string;

    @Example(10.2)
    @Description("Is a price after apply discount or original price")
    currentPrice: number;

    @Example(15)
    @Description("Present if product has a discount")
    originalPrice?: number | null;

    constructor(product: ProductModel) {
        this.id = product.id;
        this.coverImageUrl = product.coverImageUrl;
        this.name = product.name;
        if (product.discount) {
            this.currentPrice = product.price - product.discount;
            this.originalPrice = product.price;
        } else {
            this.currentPrice = product.price;
        }
    }
}
