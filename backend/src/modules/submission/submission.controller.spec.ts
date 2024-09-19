import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { ConfigService } from '@nestjs/config';

describe('SubmissionController', () => {
    let controller: SubmissionController;
    let submissionService: SubmissionService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubmissionController],
            providers: [
                {
                    provide: SubmissionService,
                    useValue: {
                        getSubmissionsList: jest.fn().mockResolvedValue([]),
                        getSubmissionListByProblemId: jest.fn().mockResolvedValue([]),
                        getSubmissionAndProblem: jest.fn().mockResolvedValue({}),
                        getSubmissionPagination: jest.fn().mockResolvedValue({}),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(10),
                    },
                },
            ],
        }).compile();

        controller = module.get<SubmissionController>(SubmissionController);
        submissionService = module.get<SubmissionService>(SubmissionService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get submission list', async () => {
        const result = await controller.getSubmissionList(1);
        expect(result).toEqual([]);
        expect(submissionService.getSubmissionsList).toHaveBeenCalledWith(1);
    });

    it('should get submission list by problem ID', async () => {
        const result = await controller.getSubmissionListByProblemId(1, 1);
        expect(result).toEqual([]);
        expect(submissionService.getSubmissionListByProblemId).toHaveBeenCalledWith(1, 1);
    });

    it('should get submission and problem', async () => {
        const result = await controller.getSubmissionAndProblem(1);
        expect(result).toEqual({});
        expect(submissionService.getSubmissionAndProblem).toHaveBeenCalledWith(1);
    });

    it('should get total submissions and paginate', async () => {
        const result = await controller.getTotalSubmissionsAndPaginate(1);
        expect(result).toEqual({});
        expect(submissionService.getSubmissionPagination).toHaveBeenCalledWith(1, 10);
    });
});