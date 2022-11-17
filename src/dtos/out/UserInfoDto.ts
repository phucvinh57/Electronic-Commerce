import { Gender, UserModel } from "@tsed/prisma";
import { Enum, Example, Nullable, Property } from "@tsed/schema";

export class UserInfoDto {
    @Example("0e4c33a2-ad1a-4dc8-895a-cf6c6452b99c")
    userId: string;

    @Example("Vinh")
    firstName: string;

    @Example("Nguyen Phuc")
    lastName: string;

    @Example("npvinh0507@gmail.com")
    @Nullable(String)
    email: string | null;

    @Example("0373 395 726")
    @Nullable(String)
    phone: string | null;

    @Example("MALE")
    @Enum(Gender)
    @Nullable(Gender)
    gender: Gender | null;

    @Example("2022-11-17 19:00")
    @Nullable(Date)
    @Property(Date)
    birthday: Date | null;

    @Example("https://avatars.githubusercontent.com/u/69946748")
    @Nullable(String)
    avatarUrl: string | null;

    constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phone = user.phone;
        this.gender = user.gender;
        this.birthday = user.birthday;
        this.avatarUrl = user.avatarUrl;
    }
}
