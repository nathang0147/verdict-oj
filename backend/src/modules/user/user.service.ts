import {Inject, Injectable} from '@nestjs/common';
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {User} from "./entities/user.entity";
import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";
import {CreateUserDto} from "@modules/user/dto/create.user.dto";

@Injectable()
export class UserService extends BaseServiceAbstract<User>{
    constructor(
        @Inject('UsersRepositoryInterfaces')
        private readonly usersRepository: UsersRepositoryInterfaces
    ) {
        super(usersRepository);
    }

    async create(createDto: CreateUserDto): Promise<User> {
        const user = await this.usersRepository.create({
            ...createDto,
        });
        return user;
    }
}
