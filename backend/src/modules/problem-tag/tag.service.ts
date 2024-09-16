import {Inject, Injectable} from "@nestjs/common";
import {TagRepositoryInterface} from "@modules/problem-tag/interface/tag.interface";
import {BaseServiceAbstract} from "../../services/base/base.abstract.service";
import {Tag} from "@modules/problem-tag/entities/tag.entity";

@Injectable()
export class TagService extends BaseServiceAbstract<Tag>{
    constructor(
        @Inject('TagRepositoryInterface')
        private readonly tagRepository: TagRepositoryInterface
    ) {
        super(tagRepository);
    }

    async searchTags(id: number, name: string) {
        return await this.tagRepository.searchTags(id, name);
    }

    async getTagById(id: string) {
        return await this.tagRepository.findOneByCondition({id});
    }

    async addTag(name: string) {
        return await this.tagRepository.create({name});
    }

    async updateTag(id: string, name: string) {
        return await this.tagRepository.update(id, {name});
    }

    async deleteTag(id: string) {
        return await this.tagRepository.permanentDelete(id);
    }

    async getTags() {
        return await this.tagRepository.findAll();
    }

    async getTagsWithProblemId(problemId: number) {
        return await this.tagRepository.getTagsWithProblemId(problemId);
    }
}