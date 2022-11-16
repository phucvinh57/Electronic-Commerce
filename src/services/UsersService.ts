import { BadRequest, InternalServerError } from "@tsed/exceptions";

import { Injectable } from "@tsed/di";
import { PrismaClient } from "@prisma/client";
import { UserDetailDto } from "@dtos/out";

@Injectable()
export class UsersService {
    // Supertoken is not working normally with Ts.ed
    // @Inject()
    // private usersRepository: UsersRepository
    private usersRepository = new PrismaClient().user;

    async getUserInfo(userId: string): Promise<UserDetailDto> {
        const user = await this.usersRepository.findFirst({
            select: {
                id: true,
                userId: true,
                firstName: true,
                lastName: true
            },
            where: {
                userId: userId
            }
        });
        if (user == null) {
            throw new BadRequest("User not found !");
        }

        return new UserDetailDto(user);
    }

    async createUser(userId: string, firstName: string, lastName: string): Promise<UserDetailDto> {
        try {
            const user = await this.usersRepository.create({
                data: {
                    userId,
                    firstName: firstName,
                    lastName: lastName
                }
            });
            return new UserDetailDto(user);
        } catch (err) {
            // May
            throw new InternalServerError(err.message);
        }
    }

    async updateUser(userId: string, firstName: string, lastName: string): Promise<UserDetailDto> {
        try {
            const user = await this.usersRepository.update({
                data: {
                    firstName,
                    lastName
                },
                where: { userId },
                select: {
                    id: true,
                    userId: true,
                    firstName: true,
                    lastName: true
                }
            });
            return new UserDetailDto(user);
        } catch (err) {
            throw new InternalServerError(err.message);
        }
    }
}
