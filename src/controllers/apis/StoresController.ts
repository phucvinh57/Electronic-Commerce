import { ID_LENGTH } from "@constants";
import { GetProductsQueryDto, GetStoresQueryDto } from "@dtos/in";
import { StoreDto, StoreWithProductsDto } from "@dtos/out";
import { StoresService } from "@services";
import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Description, MaxLength, MinLength, Post, Returns } from "@tsed/schema";

@Controller("/stores")
export class StoresController {
    @Inject()
    private storesService: StoresService;

    @Post("/")
    @Description("Get list of stores")
    @Returns(200, Array).Of(StoreDto)
    async getStores(@BodyParams() query: GetStoresQueryDto): Promise<StoreDto[]> {
        return this.storesService.getStores(query);
    }

    @Post("/:id/products")
    @Description("Get products of store")
    @Returns(200, StoreWithProductsDto)
    async getProductsOfAStore(
        @PathParams("id")
        @MinLength(ID_LENGTH)
        @MaxLength(ID_LENGTH)
        storeId: string,

        @BodyParams()
        query: GetProductsQueryDto
    ): Promise<StoreWithProductsDto> {
        return this.storesService.getProducts(storeId, query);
    }
}
