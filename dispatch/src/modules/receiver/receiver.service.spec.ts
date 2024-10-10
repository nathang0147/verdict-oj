import { Test, TestingModule } from '@nestjs/testing';
import { ReceiverService } from './receiver.service';
import { Context } from './context.service';
import { SubmissionRepository, ProblemRepository, TestcaseRepository } from '@repositories/index.repository';
import { JSWorkerService } from '@modules/worker/worker.service';
import { ConfigService } from '@nestjs/config';
import { SubmissionLanguage } from '@modules/index/entities/enum/submission.enum';
import { Submission } from "@modules/index/entities/submission.entity";
import { Problem } from "@modules/index/entities/problem.entity";
import { Testcase } from "@modules/index/entities/testcase.entity";

describe('ReceiverService', () => {
    let receiverService: ReceiverService;
    let submissionRepository: SubmissionRepository;
    let problemRepository: ProblemRepository;
    let testcaseRepository: TestcaseRepository;
    let jsWorkerService: JSWorkerService;
    let context: Context;

    beforeEach(async () => {
        const configServiceMock = {
            get: jest.fn((key: string) => {
                switch (key) {
                    case 'tempDir':
                        return 'tmp';
                    case 'tempFileName':
                        return 'Main';
                    case 'timeout':
                        return 1000;
                    case 'outputMaxLength':
                        return 1000;
                    case 'jsExec':
                        return 'jsExec';
                    case 'cSuffix':
                        return 'cSuffix';
                    case 'cppSuffix':
                        return 'cppSuffix';
                    case 'cCompiler':
                        return 'cCompiler';
                    case 'cppCompiler':
                        return 'cppCompiler';
                    case 'cSTD':
                        return 'cSTD';
                    case 'cppSTD':
                        return 'cppSTD';
                    default:
                        return null; // Default case when an env var is not set in Jest
                }
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReceiverService,
                { provide: Context, useValue: { process: jest.fn() } },
                { provide: SubmissionRepository, useValue: { findOneById: jest.fn(), create: jest.fn() } },
                { provide: ProblemRepository, useValue: { findBySubmissionId: jest.fn() } },
                { provide: TestcaseRepository, useValue: { findAllByProblemId: jest.fn() } },
                { provide: JSWorkerService, useValue: { save: jest.fn(), compile: jest.fn(), run: jest.fn() } },
                { provide: ConfigService, useValue: configServiceMock },
            ],
        }).compile();

        receiverService = module.get<ReceiverService>(ReceiverService);
        submissionRepository = module.get<SubmissionRepository>(SubmissionRepository);
        problemRepository = module.get<ProblemRepository>(ProblemRepository);
        testcaseRepository = module.get<TestcaseRepository>(TestcaseRepository);
        jsWorkerService = module.get<JSWorkerService>(JSWorkerService);
        context = module.get<Context>(Context);
    });

    it('should process submission with JSWorkerService', async () => {
        const submissionId = 1;

        // Mock submission, problem, and testcases data
        const mockSubmission = {
            id: submissionId,
            language: SubmissionLanguage.LANGUAGE_JAVASCRIPT,
            code: "function twoSum(nums, target) { for (let i = 0; i < nums.length; i++) { for (let j = i + 1; j < nums.length; j++) { if (nums[i] + nums[j] === target) { return [i, j]; } } } }" } as Submission;
        const mockProblem = {
            id: 1,
            submissionId,
            methodName: "twoSum",
            runtimeLimit: 1000,
            memoryLimit: 125,
        };
        const mockTestcases = [
            { id: 1, input: 'test', output: 'test' },
            {
                id: 2,
                input: "[2, 7, 11, 15], 9",
                output: "[0, 1]"
            },
            {
                id: 3,
                input: "[3, 2, 4], 6",
                output: "[1, 2]"
            },
            {
                id: 4,
                input: "[3, 3], 6",
                output: "[0, 1]"
            },
        ] as Testcase[];

        // Mock repository methods
        submissionRepository.findOneById = jest.fn().mockResolvedValue(mockSubmission);
        problemRepository.findBySubmissionId = jest.fn().mockResolvedValue(mockProblem);
        testcaseRepository.findAllByProblemId = jest.fn().mockResolvedValue(mockTestcases);

        // Call handleMessage
        await receiverService.handleMessage(submissionId);

        // Check if context is set correctly
        expect(context.submission).toEqual(mockSubmission);
        expect(context.problem).toEqual(mockProblem);
        expect(context.testcases).toEqual(mockTestcases);
        expect(context.worker).toBe(jsWorkerService);

        // Ensure context.process() was called
        expect(context.process).toHaveBeenCalled();
    });

    it('should log an error if submission is not found', async () => {
        const submissionId = 1;

        // Mock submissionRepository to return null
        submissionRepository.findOneById = jest.fn().mockResolvedValue(null);

        // Call handleMessage
        await receiverService.handleMessage(submissionId);

        // Check that process was not called
        expect(context.process).not.toHaveBeenCalled();
    });

    it('should log an error if problem is not found', async () => {
        const submissionId = 1;

        // Mock submission and problem data
        const mockSubmission = { id: submissionId, language: SubmissionLanguage.LANGUAGE_JAVASCRIPT } as Submission;

        submissionRepository.findOneById = jest.fn().mockResolvedValue(mockSubmission);
        problemRepository.findBySubmissionId = jest.fn().mockResolvedValue(null); // Problem not found

        // Call handleMessage
        await receiverService.handleMessage(submissionId);

        // Check that process was not called
        expect(context.process).not.toHaveBeenCalled();
    });

    it('should log an error if testcases are not found', async () => {
        const submissionId = 1;

        // Mock submission and problem data
        const mockSubmission = { id: submissionId, language: SubmissionLanguage.LANGUAGE_JAVASCRIPT } as Submission;
        const mockProblem =  {
            id: 1,
            submissionId,
            methodName: "twoSum",
            runtimeLimit: 1000,
            memoryLimit: 125,
        };

        submissionRepository.findOneById = jest.fn().mockResolvedValue(mockSubmission);
        problemRepository.findBySubmissionId = jest.fn().mockResolvedValue(mockProblem);
        testcaseRepository.findAllByProblemId = jest.fn().mockResolvedValue(null); // Testcases not found

        // Call handleMessage
        await receiverService.handleMessage(submissionId);

        // Check that process was not called
        expect(context.process).not.toHaveBeenCalled();
    });
});
