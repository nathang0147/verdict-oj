import {UsersRepositoryInterfaces} from "@modules/user/interfaces/users.interfaces";
import {User} from "@modules/entities/user.entity";
import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

export class UsersRepository
    extends BaseRepositoryAbstract<User>
    implements UsersRepositoryInterfaces
{
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {
        super(usersRepository);
    }
}