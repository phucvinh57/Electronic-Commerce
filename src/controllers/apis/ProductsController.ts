import { ID_LENGTH } from "@constants";
import { GetProductsQueryDto } from "@dtos/in";
import { ProductDetailDto, ProductBriefDto } from "@dtos/out";
import { ProductsService } from "@services";
import { BodyParams, Controller, Inject, PathParams } from "@tsed/common";
import { Description, Get, MaxLength, MinLength, Post, Returns } from "@tsed/schema";

@Controller("/products")
@Description("Catalog page")
export class ProductsController {
    @Inject()
    private productsService: ProductsService;

    @Post("/")
    @Returns(200, Array).Of(ProductBriefDto)
    @Description("Get products using a filter")
    async getProducts(@BodyParams() query: GetProductsQueryDto): Promise<ProductBriefDto[]> {
        return this.productsService.getByCondition(query);
    }

    @Get("/:id")
    @Returns(200, ProductDetailDto)
    @Description("Get a product by id")
    async getProductById(
        @PathParams("id")
        @MinLength(ID_LENGTH)
        @MaxLength(ID_LENGTH)
        productId: string
    ) {
        return this.productsService.getById(productId);
    }
}
