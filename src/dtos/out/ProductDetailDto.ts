import { InternalServerError } from "@tsed/exceptions";
import { DiscountType, ProductModel, ProductSize, RatingModel } from "@tsed/prisma";
import { CollectionOf, Description, Enum, Example, Max, Min, Nullable } from "@tsed/schema";

class ProductRating {
    @Example(1.5)
    @Min(0)
    @Max(5)
    star: number;

    @Example("0e4c33a2-ad1a-4dc8-895a-cf6c6452b99c")
    userId: string;

    @Example("0e4c33a2-ad1a-4dc8-895a-cf6c6452b99c")
    userFullName: string;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    @Nullable(String)
    userAvatarUrl: string | null;

    @Example("# This is header")
    @Description("Comment is in markdown rule")
    @Nullable(String)
    comment: string | null;

    constructor(rating: RatingModel) {
        this.star = rating.star;
        this.userId = rating.user.userId;
        this.userFullName = rating.user.firstName + " " + rating.user.lastName;
        this.comment = rating.comment;
        this.userAvatarUrl = rating.user.avatarUrl;
    }
}

export class ProductDetailDto {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Example("T-shirt")
    name: string;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    coverImageUrl: string;

    @CollectionOf(String)
    imageUrls: string[];

    @Description("Markdown text")
    description: string;

    @Example(15.2)
    currentPrice: number;

    @Example(20)
    originalPrice?: number;

    @Example(25)
    discount?: number;

    @Example(DiscountType.PERCENT)
    @Enum(DiscountType)
    discountType?: DiscountType;

    @CollectionOf(String)
    colors: Set<string>;

    @Enum(ProductSize)
    sizes: Set<ProductSize>;

    @CollectionOf(ProductRating)
    ratings: ProductRating[];

    constructor(product: ProductModel) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrls = product.imageUrls;
        this.description = product.description;
        if (product.discount && product.discountType) {
            if (product.discountType === DiscountType.PERCENT)
                this.currentPrice = product.price * (1 - product.discount);
            else if (product.discountType === DiscountType.VALUE)
                this.currentPrice = product.price - product.discount;
            else throw new InternalServerError("Incorrect discount type");
            this.originalPrice = product.price;
        } else {
            this.currentPrice = product.price;
        }
        this.discount = product.discount ? product.discount : undefined;
        this.discountType = product.discountType ? product.discountType : undefined;

        const colors = new Set<string>();
        const sizes = new Set<ProductSize>();
        product.types.forEach((type) => {
            colors.add(type.color);
            sizes.add(type.size);
        });
        this.colors = colors;
        this.sizes = sizes;

        this.coverImageUrl = product.coverImageUrl;
        this.ratings = product.ratings.map((rating) => new ProductRating(rating));
    }
}
