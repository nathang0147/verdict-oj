import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Tag} from "@modules/problem-tag/entities/tag.entity";
import {TagRepositoryInterface} from "@modules/problem-tag/interface/tag.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class TagRepository
    extends BaseRepositoryAbstract<Tag>
    implements TagRepositoryInterface{
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) {
        super(tagRepository);
    }

    async searchTags(id: string, name: string) {
        return await this.tagRepository.createQueryBuilder('tag')
            .where('tag.id == :id',{id})
            .andWhere('tag.name LIKE name', {name})
            .getMany();
    }
}