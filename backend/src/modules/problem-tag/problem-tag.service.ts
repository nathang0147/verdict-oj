import {Inject, Injectable} from '@nestjs/common';
import {ProblemTagRepositoryInterface} from "@modules/problem-tag/interface/problem-tag.interface";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {CreateProblemTagDto} from "@modules/problem-tag/dto/create.problem-tag.dto";

@Injectable()
export class ProblemTagService {
    constructor(
        @Inject('ProblemTagRepositoryInterface')
        private readonly problemTagRepository: ProblemTagRepositoryInterface
    ) {}

    async addProblemTag(createDto: CreateProblemTagDto): Promise<ProblemTag> {
        return await this.problemTagRepository.create( createDto );
    }

    async getProblemByTagId(tagId: number): Promise<ProblemTag> {
        return await this.problemTagRepository.findOneByCondition({tagId});
    }

    async deleteProblemTag(problemTagId: number): Promise<boolean> {
        return this.problemTagRepository.permanentDelete(problemTagId);
    }
}
