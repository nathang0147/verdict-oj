import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Submission} from "@modules/index/entities/submission.entity";
import {Problem} from "@modules/index/entities/problem.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";

@Injectable()
export class IndexService {
    constructor(
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>,

        @InjectRepository(Problem)
        private readonly problemRepository: Repository<Problem>,

        @InjectRepository(Testcase)
        private readonly testcaseRepository: Repository<Testcase>,

    ) {}

    async getSubmissionById(id: number) {
        return this.submissionRepository.findOneBy({id}).catch((error) => {throw new NotFoundException('Submission not found')});
    }

    async getTestcaseByProblemId(problemId: number) {
        return this.testcaseRepository.find({where: {problemId}}).catch((error) => {throw new NotFoundException('Testcase not found')});
    }
}
