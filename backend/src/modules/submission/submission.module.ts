import {forwardRef, Module} from '@nestjs/common';
import {SubmissionService} from './submission.service';
import {SubmissionController} from './submission.controller';
import {SubmissionRepository} from "@repositories/submission.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Submission} from "@modules/submission/entities/submission.entity";
import {ProblemModule} from "@modules/problem/problem.module";
import {UserModule} from "@modules/user/user.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => ProblemModule),
        TypeOrmModule.forFeature([Submission])],
    controllers: [SubmissionController],
    providers: [
        SubmissionService,
        {
            provide: 'SubmissionsRepositoryInterface',
            useClass: SubmissionRepository
        }],
    exports: [
        SubmissionService,
        TypeOrmModule.forFeature([Submission])],
})
export class SubmissionModule {
}
