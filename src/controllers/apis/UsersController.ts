import { UpdateUserInfoDto } from "@dtos/in";
import { UserInfoDto } from "@dtos/out";
import { UsersService } from "@services";
import { Controller, Inject } from "@tsed/di";
import { UseBefore } from "@tsed/platform-middlewares";
import { BodyParams, Session } from "@tsed/platform-params";
import { Description, Get, Put, Returns } from "@tsed/schema";
import { SessionContainer } from "supertokens-node/recipe/session";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

@Controller("/users")
@UseBefore(verifySession())
@Description("Account page")
export class UsersController {
    @Inject()
    private usersService: UsersService;

    @Get("/info")
    @Description("Get user's info")
    @Returns(200, UserInfoDto)
    async getInfo(@Session() session: SessionContainer): Promise<UserInfoDto> {
        return this.usersService.getUserInfo(session.getUserId());
    }

    @Put("/")
    @Description("Update user's information in accout page")
    @Returns(200, String)
    async updateInfo(
        @Session() session: SessionContainer,

        @BodyParams()
        payload: UpdateUserInfoDto
    ) {
        return this.usersService.updateUserInfo(session.getUserId(), payload);
    }
}
