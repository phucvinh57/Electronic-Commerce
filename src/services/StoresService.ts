import { GetStoresQueryDto } from "@dtos/in";
import { StoreDto } from "@dtos/out";
import { Inject, Injectable } from "@tsed/di";
import { StoresRepository } from "@tsed/prisma";

@Injectable()
export class StoresService {
    @Inject()
    private storesRepository: StoresRepository;

    async getStores(query: GetStoresQueryDto): Promise<StoreDto[]> {
        const stores = await this.storesRepository.findMany({
            skip: (query.pageNumber - 1) * query.numOfItemsPerPage,
            take: query.numOfItemsPerPage
        });

        return stores.map((store) => new StoreDto(store));
    }
}
