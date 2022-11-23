import { Gender } from "@tsed/prisma";
import { Email, Enum, Example, Nullable, Property, Required } from "@tsed/schema";

export class UpdateUserInfoDto {
    @Example("Vinh")
    @Required()
    firstName: string;

    @Required()
    @Example("Nguyen Phuc")
    lastName: string;

    @Example("npvinh0507@gmail.com")
    @Required()
    @Email()
    @Nullable(String)
    email: string;

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

    @Nullable(String)
    @Example("https://avatars.githubusercontent.com/u/69946748")
    avatarUrl?: string | null;
}
