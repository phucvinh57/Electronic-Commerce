import { Required, Min, Example, Max } from "@tsed/schema";

export class GetStoresQueryDto {
    @Required()
    @Min(1)
    @Example(1)
    pageNumber: number;

    @Required()
    @Min(10)
    @Max(50)
    @Example(25)
    numOfItemsPerPage: number;
}
