import {Module} from '@nestjs/common';
import {TestcaseService} from './testcase.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {TestcaseRepository} from "@repositories/testcase.repository";
import {ProblemModule} from "@modules/problem/problem.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Testcase])
    ],
    controllers: [],
    providers: [
        TestcaseService,
        {
            provide: 'TestcaseRepositoryInterface',
            useClass: TestcaseRepository
        }
    ],
    exports: [TestcaseService, TypeOrmModule.forFeature([Testcase])],
})
export class TestcaseModule {
}
