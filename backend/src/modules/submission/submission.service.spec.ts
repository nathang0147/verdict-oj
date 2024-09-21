// submission.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from '@repositories/submission.repository';

describe('SubmissionService', () => {
    let service: SubmissionService;
    let submissionRepository: SubmissionRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubmissionService,
                {
                    provide: 'SubmissionsRepositoryInterface',
                    useValue: {
                        getSubmissionByUserIdAndProblemId: jest.fn().mockResolvedValue([]),
                        findAll: jest.fn().mockResolvedValue({ count: 0, items: [] }),
                        getTotalSubmissionsCount: jest.fn().mockResolvedValue(0),
                        getTotalSubmissionsCountByProblemId: jest.fn().mockResolvedValue(0),
                        getSubmissionsList: jest.fn().mockResolvedValue([]),
                        getSubmissionListByProblemId: jest.fn().mockResolvedValue([]),
                        findOneById: jest.fn().mockResolvedValue(null),
                        getProblem: jest.fn().mockResolvedValue(null),
                        getUser: jest.fn().mockResolvedValue(null),
                    },
                },
            ],
        }).compile();

        service = module.get<SubmissionService>(SubmissionService);
        submissionRepository = module.get<SubmissionRepository>('SubmissionsRepositoryInterface');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get submissions by user ID and problem ID', async () => {
        const userId = '1';
        const problemId = 1;
        const result = await service.getSubmissionByUserIdAndProblemId(userId, problemId);
        expect(result).toEqual([]);
        expect(submissionRepository.getSubmissionByUserIdAndProblemId).toHaveBeenCalledWith(userId, problemId);
    });

    it('should get total submissions count', async () => {
        const result = await service.getTotalSubmissionsCount();
        expect(result).toEqual(0);
        expect(submissionRepository.getTotalSubmissionsCount).toHaveBeenCalled();
    });
});