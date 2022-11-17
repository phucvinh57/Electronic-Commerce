import { GetProductsQueryDto } from "@dtos/in";
import { ProductSummaryDto } from "@dtos/out";
import { Inject, Injectable } from "@tsed/di";
import { ProductsRepository } from "@tsed/prisma";

@Injectable()
export class ProductsService {
    @Inject()
    private productsRepository: ProductsRepository;

    async getProducts(query: GetProductsQueryDto): Promise<ProductSummaryDto[]> {
        const products = await this.productsRepository.findMany({
            select: {
                id: true,
                coverImageUrl: true,
                name: true,
                price: true,
                discount: true,
                discountType: true
            },
            where: {
                productTypes: {
                    some: query.filter
                        ? {
                              color: query.filter.color ? query.filter.color : undefined,
                              size: query.filter.size ? { in: query.filter.size } : undefined
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
            skip: (query.pageNumber - 1) * query.numOfItemsPerPage,
            take: query.numOfItemsPerPage
        });

        return products.map((product) => new ProductSummaryDto(product));
    }
}
