import { StoreModel } from "@tsed/prisma";
import { Example } from "@tsed/schema";

export class StoreDto {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Example("Coolmate.me")
    name: string;

    @Example("Lorem ispum ...")
    description: string;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    brandUrl: string;

    constructor(store: StoreModel) {
        this.id = store.id;
        this.name = store.name;
        this.description = store.description;
        this.brandUrl = store.brandUrl;
    }
}
