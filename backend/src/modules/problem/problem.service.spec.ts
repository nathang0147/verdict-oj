import { Test, TestingModule } from '@nestjs/testing';
import { ProblemService } from './problem.service';
import { ProblemRepository } from '@repositories/problem.repository';
import { Cache } from 'cache-manager'; // Import Cache module
import { RedisService } from '@modules/cache/redis.service';
import { QueueService } from '@modules/queue/queue.service';
import { SubmitDto } from '@modules/problem/dto/submit.dto';
import { of } from 'rxjs';
import { SubmissionLanguage } from '@modules/submission/entities/enum/submission.enum';

describe('ProblemService', () => {
    let service: ProblemService;
    let problemRepository: ProblemRepository;
    let redisService: RedisService;
    let queueService: QueueService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProblemService,
                {
                    provide: 'ProblemRepositoryInterface',
                    useValue: {
                        findAllWithSubFields: jest.fn().mockResolvedValue({ items: [], count: 0 }),
                        getSubmissionByUserIdAndProblemId: jest.fn().mockResolvedValue(null),
                        getAcceptedSubmissionCount: jest.fn().mockResolvedValue(0),
                        getSubmissionCount: jest.fn().mockResolvedValue(0),
                        submit: jest.fn().mockResolvedValue(1),
                    },
                },
                {
                    provide: RedisService,
                    useValue: {
                        getBit: jest.fn().mockResolvedValue(0),
                        setBit: jest.fn().mockResolvedValue(true),
                    },
                },
                {
                    provide: QueueService,
                    useValue: {
                        send: jest.fn().mockResolvedValue(of({})),
                    },
                },
            ],
        }).compile();

        service = module.get<ProblemService>(ProblemService);
        problemRepository = module.get<ProblemRepository>('ProblemRepositoryInterface');
        redisService = module.get<RedisService>(RedisService);
        queueService = module.get<QueueService>(QueueService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should submit a problem', async () => {
        const submitDto: SubmitDto = { problemId: 1, language: 2, userId: '1', code: 'gg' };
        const result = await service.submit(submitDto);
        expect(result).toEqual({
            code: 0,
            message: 'Success',
            data: 1,
        });
        expect(problemRepository.submit).toHaveBeenCalledWith(submitDto);
        expect(redisService.setBit).toHaveBeenCalledWith('userTriedKeyCount:1', 1, 1);
        expect(queueService.send).toHaveBeenCalledWith({ id: 1 });
    });
});