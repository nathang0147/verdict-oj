import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@modules/user/entities/user.entity";
import {UsersRepository} from "@repositories/users.repository";
import {UserRolesModule} from "@modules/user-roles/user-roles.module";
import {Submission} from "@modules/submission/entities/submission.entity";
import {RedisModule} from "@modules/cache/redis.module";

@Module({
    imports: [UserRolesModule, TypeOrmModule.forFeature([User, Submission]), RedisModule],
    controllers: [UserController],
    providers: [UserService, {provide: 'UsersRepositoryInterface', useClass: UsersRepository}],
    exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {
}
