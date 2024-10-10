import {Module} from '@nestjs/common';
import {TestcaseService} from './testcase.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {TestcaseRepository} from "@repositories/testcase.repository";
import {Problem} from "@modules/problem/entities/problem.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Testcase, Problem]),
    ],
    controllers: [],
    providers: [
        TestcaseService,
        {
            provide: 'TestcaseRepositoryInterface',
            useClass: TestcaseRepository
        },
    ],
    exports: [TestcaseService, TypeOrmModule.forFeature([Testcase])],
})
export class TestcaseModule {
}
