import { ProductSortCriterion } from "@constants";
import { GetProductsQueryDto, GetStoresQueryDto } from "@dtos/in";
import { StoreDto, StoreWithProductsDto } from "@dtos/out";
import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
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

    async getProducts(storeId: string, query: GetProductsQueryDto): Promise<StoreWithProductsDto> {
        let orderBy: Record<string, unknown> | undefined;
        if (!query.order) {
            orderBy = undefined;
        } else if (query.order.criterion === ProductSortCriterion.NEW_ARRIVAL) {
            orderBy = { createdAt: query.order.order };
        } else if (query.order.criterion === ProductSortCriterion.BEST_SELLER) {
            orderBy = { orders: { _count: query.order.order } };
        } else if (query.order.criterion === ProductSortCriterion.ON_SALE) {
            orderBy = { discount: query.order.order };
        } else if (query.order.criterion === ProductSortCriterion.NONE) {
            orderBy = undefined;
        }

        const store = await this.storesRepository.findUnique({
            select: {
                id: true,
                name: true,
                brandUrl: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        coverImageUrl: true,
                        name: true,
                        price: true,
                        discount: true
                    },
                    where: {
                        createdAt: { gte: query.fromDate },
                        types: {
                            some: query.filter
                                ? {
                                      color: query.filter.color ? query.filter.color : undefined,
                                      size: query.filter.size
                                          ? { in: query.filter.size }
                                          : undefined
                                  }
                                : undefined
                        },
                        price:
                            query.filter && query.filter.priceRange
                                ? {
                                      gte: query.filter.priceRange.from,
                                      lte: query.filter.priceRange.to
                                  }
                                : undefined,
                        genders:
                            query.filter && query.filter.genders
                                ? {
                                      hasSome: query.filter.genders
                                  }
                                : undefined
                    },
                    orderBy,
                    skip: (query.pageNumber - 1) * query.numOfItemsPerPage,
                    take: query.numOfItemsPerPage
                }
            },
            where: { id: storeId }
        });

        if (!store) throw new BadRequest("Store does not exists !");

        return new StoreWithProductsDto(store);
    }
}
