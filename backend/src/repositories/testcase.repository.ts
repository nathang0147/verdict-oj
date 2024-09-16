import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Testcase} from "@modules/testcase/entities/testcase.entity";
import {TestcaseRepositoryInterface} from "@modules/testcase/interfaces/testcase.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";

@Injectable()
export class TestcaseRepository extends BaseRepositoryAbstract<Testcase> implements TestcaseRepositoryInterface{
    constructor(
        @InjectRepository(Testcase)
        private readonly testcaseRepository: Repository<Testcase>
    ) {
        super(testcaseRepository);
    }

    async getSampleTestcases(problemId: number, numberCases: number): Promise<Testcase[]> {
        return await this.testcaseRepository.createQueryBuilder('testcase')
            .where('testcase.problemId = :problemId', {problemId})
            .limit(numberCases)
            .getMany();
    }

    async searchTestcasesByProblemId(problemId: number, input?: string, output?: string): Promise<Testcase[]> {
        return await this.testcaseRepository.createQueryBuilder('testcase')
            .where('testcase.problemId = :problemId', {problemId})
            .andWhere(input ? 'testcase.input LIKE :input' : '1=1', {input})
            .andWhere(output ? 'testcase.output LIKE :output' : '1=1', {output})
            .orderBy('testcase.updatedAt', 'DESC')
            .getMany();
    }
}