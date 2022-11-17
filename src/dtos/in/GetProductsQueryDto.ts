import { COLOR_VALUE_LENGTH } from "@constants";
import { BadRequest } from "@tsed/exceptions";
import { Gender, ProductSize } from "@tsed/prisma";
import {
    Allow,
    CollectionOf,
    Example,
    Max,
    MaxLength,
    Min,
    MinLength,
    MinProperties,
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

class ProductQueryFilter {
    @CollectionOf(Gender)
    @Nullable(Gender)
    @Example("MALE", "FEMALE")
    genders?: Gender[] | null;

    @Property(PriceRange)
    @Nullable(PriceRange)
    priceRange?: PriceRange | null;

    @Nullable(String)
    @MaxLength(COLOR_VALUE_LENGTH)
    @MinLength(COLOR_VALUE_LENGTH)
    @Example("#343a40")
    color?: string | null;

    @CollectionOf(ProductSize)
    size?: ProductSize[] | null;
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

    @Required()
    @Allow(null)
    @Nullable(ProductQueryFilter)
    @Property(ProductQueryFilter)
    @MinProperties(1)
    filter: ProductQueryFilter | null;
}
