import {Inject, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Context} from "@modules/receiver/context.service";
import {ProblemRepository, SubmissionRepository, TestcaseRepository} from "@repositories/index.repository";
import {SubmissionLanguage} from "@modules/index/entities/enum/submission.enum";
import {JSWorkerService} from "@modules/worker/worker.service";

@Injectable()
export class ReceiverService {
    private readonly logger = new Logger(ReceiverService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly context: Context,
        @Inject()
        private readonly submissionRepository: SubmissionRepository,
        @Inject()
        private readonly problemRepository: ProblemRepository,
        @Inject()
        private readonly testcaseRepository: TestcaseRepository,
        // private readonly cLikeWorker: CLikeWorker,
        private readonly jsWorker: JSWorkerService,
    ) {}

    async handleMessage(submissionId: number): Promise<void> {
        const submission = await this.submissionRepository.findOneById(submissionId);
        if (!submission) {
            this.logger.error(`Submission with id ${submissionId} not found`);
            return;
        }

        const problem = await this.problemRepository.findBySubmissionId(submissionId);
        if (!problem) {
            this.logger.error(`Problem with id ${submissionId} not found`);
            return;
        }

        const testcases = await this.testcaseRepository.findAllByProblemId(problem.id);
        if (!testcases) {
            this.logger.error(`Testcases for problem with id ${submission.problemId} not found`);
            return;
        }

        this.context.submission = submission;
        this.context.problem = problem;
        this.context.testcases = testcases;

        switch (submission.language) {
            case SubmissionLanguage.LANGUAGE_C:
                // this.context.worker = this.cLikeWorker;
                this.logger.log('Context set CLikeWorker');
                break;
            case SubmissionLanguage.LANGUAGE_JAVASCRIPT:
                this.context.worker = this.jsWorker;
                this.logger.log('Context set JSWorker');
                break;
            default:
                this.logger.error(`Language ${submission.language} not supported`);
                return;
        }

        try{
            this.logger.log('Run Context')
            await this.context.process();
        }catch (e){
            this.logger.error(e.message);
        }finally {
            await this.submissionRepository.create(this.context.getSubmission);
        }

    }
}


