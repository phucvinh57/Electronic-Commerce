import { COLOR_VALUE_LENGTH, ProductSortCriterion, SortOrder } from "@constants";
import { BadRequest } from "@tsed/exceptions";
import { Gender, ProductSize } from "@tsed/prisma";
import {
    Enum,
    Example,
    Max,
    MaxLength,
    Min,
    MinLength,
    Nullable,
    Property,
    Required
} from "@tsed/schema";

class PriceRange {
    @Required()
    @Example(10.2)
    from: number;

    @Example(12.3)
    @Required()
    to: number;

    validate() {
        if (this.from > this.to) throw new BadRequest("From must less than to!");
    }
}

class ProductQueryOrder {
    @Enum(SortOrder)
    @Required()
    order: SortOrder;

    @Enum(SortOrder)
    @Required()
    criterion: ProductSortCriterion;
}

class ProductQueryFilter {
    @Enum(Gender)
    genders?: Gender[];

    @Property(PriceRange)
    @Nullable(PriceRange)
    priceRange?: PriceRange;

    @Nullable(String)
    @MaxLength(COLOR_VALUE_LENGTH)
    @MinLength(COLOR_VALUE_LENGTH)
    @Example("#343a40")
    color?: string | null;

    @Enum(ProductSize)
    size?: ProductSize[];
}

export class GetProductsQueryDto {
    @Required()
    @Min(1)
    @Example(1)
    pageNumber: number;

    @Required()
    @Min(10)
    @Max(50)
    @Example(25)
    numOfItemsPerPage: number;

    @Nullable(ProductQueryFilter)
    @Property(ProductQueryFilter)
    filter?: ProductQueryFilter | null;

    @Property(ProductQueryOrder)
    @Nullable(ProductQueryOrder)
    order?: ProductQueryOrder | null;

    @Required()
    from: Date;
}
