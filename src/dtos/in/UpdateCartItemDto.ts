import { COLOR_VALUE_LENGTH, ID_LENGTH } from "@constants";
import { ProductSize } from "@tsed/prisma";
import { Enum, MaxLength, Min, MinLength, Required } from "@tsed/schema";

export class UpdateCartItemDto {
    @Required()
    @MinLength(ID_LENGTH)
    @MaxLength(ID_LENGTH)
    itemId: string;

    @Min(1)
    quantity?: number;

    @MaxLength(COLOR_VALUE_LENGTH)
    @MinLength(COLOR_VALUE_LENGTH)
    color?: string;

    @Enum(ProductSize)
    size?: ProductSize;
}
