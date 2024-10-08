import {forwardRef, Module} from '@nestjs/common';
import {ProblemService} from './problem.service';
import {ProblemController} from './problem.controller';
import {TestcaseModule} from '@modules/testcase/testcase.module';
import {SubmissionModule} from '@modules/submission/submission.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {ProblemRepository} from "@repositories/problem.repository";
import {ProblemTagModule} from '@modules/problem-tag/problem-tag.module';
import {TestcaseRepository} from "@repositories/testcase.repository";
import {ProblemTagRepository} from "@repositories/problem-tag.repository";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {Tag} from "@modules/problem-tag/entities/tag.entity";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {RedisModule} from "@modules/cache/redis.module";
import {QueueModule} from "@modules/queue/queue.module";
import {AdminProblemController} from "@modules/problem/admin.problem.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Problem, ProblemTag, Tag, Testcase]),
        forwardRef(() => SubmissionModule),
        ProblemTagModule,
        RedisModule,
        QueueModule,
        TestcaseModule
    ],
    controllers: [ProblemController, AdminProblemController],
    providers: [
        ProblemService,
        {
            provide: 'ProblemRepositoryInterface',
            useClass: ProblemRepository
        }],
    exports: [
        ProblemService,
        TypeOrmModule.forFeature([Problem]),
        {
            provide: 'ProblemRepositoryInterface',
            useClass: ProblemRepository
        }
    ],
})
export class ProblemModule {
}
