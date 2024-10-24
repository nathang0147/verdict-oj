import {forwardRef, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@modules/user/entities/user.entity";
import {UsersRepository} from "@repositories/users.repository";
import {UserRolesModule} from "@modules/user-roles/user-roles.module";
import {Submission} from "@modules/submission/entities/submission.entity";
import {RedisModule} from "@modules/cache/redis.module";
import {ProblemModule} from "@modules/problem/problem.module";
import {SubmissionModule} from "@modules/submission/submission.module";
import {AdminUserController} from "@modules/user/admin.user.controller";

@Module({
    imports: [
        UserRolesModule,
        TypeOrmModule.forFeature([User, Submission]),
        RedisModule,
        ProblemModule,
        forwardRef(() => SubmissionModule)
    ],
    controllers: [UserController, AdminUserController ],
    providers: [UserService, {provide: 'UsersRepositoryInterface', useClass: UsersRepository}],
    exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {
}
