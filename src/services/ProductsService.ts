import { GetProductsQueryDto } from "@dtos/in";
import { ProductDetailDto, ProductSummaryDto } from "@dtos/out";
import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { ProductsRepository } from "@tsed/prisma";

@Injectable()
export class ProductsService {
    @Inject()
    private productsRepository: ProductsRepository;

    async getByCondition(query: GetProductsQueryDto): Promise<ProductSummaryDto[]> {
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
                types: {
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

    async getById(productId: string): Promise<ProductDetailDto> {
        const product = await this.productsRepository.findUnique({
            include: {
                types: {
                    select: { size: true, color: true, quantity: true }
                },
                ratings: {
                    select: {
                        star: true,
                        user: {
                            select: {
                                userId: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true
                            }
                        },
                        comment: true
                    }
                }
            },
            where: {
                id: productId
            }
        });
        if (!product) throw new BadRequest("Product does not exists !");

        return new ProductDetailDto(product);
    }
}
