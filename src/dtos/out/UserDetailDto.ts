import { UserModel } from "@tsed/prisma";
import { Example, Nullable } from "@tsed/schema";

export class UserDetailDto {
    @Example("0e4c33a2-ad1a-4dc8-895a-cf6c6452b99c")
    userId: string;

    @Example("Vinh")
    @Nullable
    firstname: string;

    @Example("Nguyen Phuc")
    @Nullable
    lastname: string;

    constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstname = user.firstName;
        this.lastname = user.lastName;
    }
}
