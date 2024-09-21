// tag.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagRepositoryInterface } from '@modules/problem-tag/interface/tag.interface';

describe('TagService', () => {
    let service: TagService;
    let tagRepository: TagRepositoryInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TagService,
                {
                    provide: 'TagRepositoryInterface',
                    useValue: {
                        searchTags: jest.fn().mockResolvedValue([]),
                        findOneByCondition: jest.fn().mockResolvedValue(null),
                        create: jest.fn().mockResolvedValue({}),
                        update: jest.fn().mockResolvedValue({}),
                        permanentDelete: jest.fn().mockResolvedValue(true),
                        findAll: jest.fn().mockResolvedValue([]),
                        getTagsWithProblemId: jest.fn().mockResolvedValue([]),
                    },
                },
            ],
        }).compile();

        service = module.get<TagService>(TagService);
        tagRepository = module.get<TagRepositoryInterface>('TagRepositoryInterface');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should search tags', async () => {
        const result = await service.searchTags(1, 'tag');
        expect(result).toEqual([]);
        expect(tagRepository.searchTags).toHaveBeenCalledWith(1, 'tag');
    });

    // Add more tests for other methods...
});