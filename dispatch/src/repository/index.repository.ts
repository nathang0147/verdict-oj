import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Problem} from "@modules/index/entities/problem.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {Submission} from "@modules/index/entities/submission.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";

@Injectable()
export class SubmissionRepository extends BaseRepositoryAbstract<Submission> {
    constructor(@InjectRepository(Submission) private readonly repository: Repository<Submission>) {
        super(repository);
    }
}

@Injectable()
export class ProblemRepository extends BaseRepositoryAbstract<Problem> {
    constructor(@InjectRepository(Problem) private readonly repository: Repository<Problem>) {
        super(repository);
    }

    async findBySubmissionId(submissionId: number): Promise<Problem> {
        return this.repository.createQueryBuilder('problem')
            .leftJoinAndSelect('problem.submissions', 'submission')
            .where('submission.id = :submissionId', { submissionId })
            .getOne();
    }
}

@Injectable()
export class TestcaseRepository extends BaseRepositoryAbstract<Testcase> {
    constructor(@InjectRepository(Testcase) private readonly repository: Repository<Testcase>) {
        super(repository);
    }

    async findAllByProblemId(problemId: number): Promise<Testcase[]> {
        return this.repository.createQueryBuilder('testcase')
            .leftJoinAndSelect('testcase.problem', 'problem')
            .where('problem.id = :problemId', { problemId })
            .getMany();
    }
}