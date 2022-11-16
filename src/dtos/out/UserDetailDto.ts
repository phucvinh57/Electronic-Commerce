import { UserModel } from "@tsed/prisma";
import { Example, Nullable } from "@tsed/schema";

export class UserDetailDto {
    @Example("632d3d4f94440a5c9ea40e38")
    id: string;

    @Example("0e4c33a2-ad1a-4dc8-895a-cf6c6452b99c")
    userId: string;

    @Example("Vinh")
    @Nullable
    firstname: string;

    @Example("Nguyen Phuc")
    @Nullable
    lastname: string;

    constructor(user: UserModel) {
        this.id = user.id;
        this.userId = user.userId;
        this.firstname = user.firstName;
        this.lastname = user.lastName;
    }
}
