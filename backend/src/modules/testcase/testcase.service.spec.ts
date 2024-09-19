// testcase.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TestcaseService } from './testcase.service';
import { TestcaseRepositoryInterface } from '@modules/testcase/interfaces/testcase.interface';

describe('TestcaseService', () => {
    let service: TestcaseService;
    let testcaseRepository: TestcaseRepositoryInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TestcaseService,
                {
                    provide: 'TestcaseRepositoryInterface',
                    useValue: {
                        getSampleTestcases: jest.fn().mockResolvedValue([]),
                        searchTestcasesByProblemId: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        service = module.get<TestcaseService>(TestcaseService);
        testcaseRepository = module.get<TestcaseRepositoryInterface>('TestcaseRepositoryInterface');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get sample testcases', async () => {
        const result = await service.getSampleTestcases(1, 5);
        expect(result).toEqual([]);
        expect(testcaseRepository.getSampleTestcases).toHaveBeenCalledWith(1, 5);
    });
});