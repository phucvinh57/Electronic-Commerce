import { BadRequest, InternalServerError } from "@tsed/exceptions";

import { Inject, Injectable } from "@tsed/di";
import { PrismaClient } from "@prisma/client";
import { UsersRepository } from "@tsed/prisma";
import { UserInfoDto } from "@dtos/out";
import { UpdateUserInfoDto } from "@dtos/in";

@Injectable()
export class UsersService {
    // Supertoken is not working normally with Ts.ed
    private userPrismaClient = new PrismaClient().user;

    @Inject()
    private usersRepository: UsersRepository = new UsersRepository();

    async getUserInfo(userId: string): Promise<UserInfoDto> {
        const user = await this.userPrismaClient.findUnique({
            where: {
                userId: userId
            }
        });
        if (user == null) {
            throw new BadRequest("User not found !");
        }

        return new UserInfoDto(user);
    }

    async updateUserInfo(userId: string, payload: UpdateUserInfoDto): Promise<string> {
        await this.usersRepository.update({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                birthday: payload.birthday,
                gender: payload.gender,
                avatarUrl: payload.avatarUrl
            },
            where: { userId }
        });

        return userId;
    }

    async createUser(
        userId: string,
        firstName: string,
        lastName: string,
        email: string
    ): Promise<string> {
        try {
            await this.userPrismaClient.create({
                data: { userId, firstName, lastName, email }
            });
            return userId;
        } catch (err) {
            throw new InternalServerError(err.message);
        }
    }
}
