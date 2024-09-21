import {Module} from '@nestjs/common';
import {TestcaseService} from './testcase.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {TestcaseRepository} from "@repositories/testcase.repository";
import {TestcaseController} from "@modules/testcase/testcase.controller";
import {ProblemModule} from "@modules/problem/problem.module";

@Module({
    imports: [
        ProblemModule,
        TypeOrmModule.forFeature([Testcase])
    ],
    controllers: [TestcaseController],
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
