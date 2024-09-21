import { Test, TestingModule } from '@nestjs/testing';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { TagService } from '@modules/problem-tag/tag.service';
import { SubmitDto } from '@modules/problem/dto/submit.dto';
import { CreateProblemDto } from '@modules/problem/dto/create.problem.dto';
import { UpdateProblemDto } from '@modules/problem/dto/update.problem.dto';

describe('ProblemController', () => {
    let controller: ProblemController;
    let problemService: ProblemService;
    let tagService: TagService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProblemController],
            providers: [
                {
                    provide: ProblemService,
                    useValue: {
                        getProblemsWithStatus: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue({}),
                        getProblemsWithTag: jest.fn().mockResolvedValue([]),
                        submit: jest.fn().mockResolvedValue({}),
                        create: jest.fn().mockResolvedValue({}),
                        update: jest.fn().mockResolvedValue({}),
                        remove: jest.fn().mockResolvedValue({}),
                    },
                },
                {
                    provide: TagService,
                    useValue: {
                        getTagsWithProblemId: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProblemController>(ProblemController);
        problemService = module.get<ProblemService>(ProblemService);
        tagService = module.get<TagService>(TagService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get problems with status', async () => {
        const req = { user: { id: '1' } };
        const result = await controller.getProblemsWithStatus(req, 0, 10);
        expect(result).toEqual([]);
        expect(problemService.getProblemsWithStatus).toHaveBeenCalledWith('1', { offset: 0, limit: 10 });
    });

    it('should submit a problem', async () => {
        const req = { user: { id: '1' } };
        const submitDto: SubmitDto = { problemId: 1, language: 2, userId: '1', code: 'gg' };
        const result = await controller.submit(req, submitDto);
        expect(result).toEqual({});
        expect(problemService.submit).toHaveBeenCalledWith(submitDto);
    });

    it('should create a problem', async () => {
        const createProblemDto: CreateProblemDto = {
            title: 'New Problem',
            description: 'Description',
            sampleInput: 'Input',
            sampleOutput: 'Output',
            difficulty: 1,
            hint: 'Hint',
            runtimeLimit: 1,
            memoryLimit: 1,
        };
        const result = await controller.createProblem(createProblemDto);
        expect(result).toEqual({});
        expect(problemService.create).toHaveBeenCalledWith(createProblemDto);
    });

    it('should update a problem', async () => {
        const updateProblemDto: UpdateProblemDto = { id:1,title: 'Updated Problem', description: 'Updated Description' };
        const result = await controller.updateProblem(updateProblemDto, 1);
        expect(result).toEqual({});
        expect(problemService.update).toHaveBeenCalledWith(1, updateProblemDto);
    });

    it('should delete a problem', async () => {
        const result = await controller.deleteProblem(1);
        expect(result).toEqual({});
        expect(problemService.remove).toHaveBeenCalledWith(1);
    });
});