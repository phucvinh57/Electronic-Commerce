import { ProductSortCriterion } from "@constants";
import { GetProductsQueryDto } from "@dtos/in";
import { ProductDetailDto, ProductBriefDto } from "@dtos/out";
import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { ProductsRepository } from "@tsed/prisma";

@Injectable()
export class ProductsService {
    @Inject()
    private productsRepository: ProductsRepository;

    private readonly getProductBriefQuery: Prisma.ProductSelect = {
        id: true,
        coverImageUrl: true,
        name: true,
        price: true,
        discount: true
    };

    async getByCondition(query: GetProductsQueryDto): Promise<ProductBriefDto[]> {
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

        const products = await this.productsRepository.findMany({
            select: this.getProductBriefQuery,
            where: {
                createdAt: { gte: query.from },
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
            orderBy,
            skip: (query.pageNumber - 1) * query.numOfItemsPerPage,
            take: query.numOfItemsPerPage
        });

        return products.map((product) => new ProductBriefDto(product));
    }

    async getById(productId: string): Promise<ProductDetailDto> {
        const selectRatingsQuery: Prisma.RatingFindManyArgs = {
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
        };

        const product = await this.productsRepository.findUnique({
            include: {
                types: {
                    select: { size: true, color: true, quantity: true }
                },
                ratings: selectRatingsQuery
            },
            where: {
                id: productId
            }
        });
        if (!product) throw new BadRequest("Product does not exists !");

        return new ProductDetailDto(product);
    }
}
