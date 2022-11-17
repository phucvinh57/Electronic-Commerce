import { GetProductsQueryDto } from "@dtos/in";
import { ProductSummaryDto } from "@dtos/out";
import { ProductsService } from "@services";
import { BodyParams, Controller, Inject } from "@tsed/common";
import { Description, Post, Returns } from "@tsed/schema";

@Controller("/products")
@Description("Catalog page")
export class ProductsController {
    @Inject()
    private productsService: ProductsService;

    @Post("/")
    @Returns(200, Array).Of(ProductSummaryDto)
    @Description("Get products using a filter")
    async getProducts(@BodyParams() query: GetProductsQueryDto): Promise<ProductSummaryDto[]> {
        return this.productsService.getProducts(query);
    }
}
