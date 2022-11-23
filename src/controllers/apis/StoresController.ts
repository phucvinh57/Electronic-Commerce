import { GetStoresQueryDto } from "@dtos/in";
import { StoreDto } from "@dtos/out";
import { StoresService } from "@services";
import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Description, Post, Returns } from "@tsed/schema";

@Controller("/stores")
export class CartController {
    @Inject()
    private storesService: StoresService;

    @Post("/")
    @Description("Get list of stores")
    @Returns(200, Array).Of(StoreDto)
    async getStores(@BodyParams() query: GetStoresQueryDto): Promise<StoreDto[]> {
        return this.storesService.getStores(query);
    }
}
