import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {Tag} from "@modules/problem-tag/entities/tag.entity";
import {TagRepositoryInterface} from "@modules/problem-tag/interface/tag.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {Problem} from "@modules/problem/entities/problem.entity";

@Injectable()
export class TagRepository
    extends BaseRepositoryAbstract<Tag>
    implements TagRepositoryInterface{
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,

        @InjectRepository(Problem)
        private readonly problemRepository: Repository<Problem>
    ) {
        super(tagRepository);
    }

    async searchTags(id: number, name: string) {
        return await this.tagRepository.createQueryBuilder('tag')
            .where('tag.id == :id',{id})
            .andWhere('tag.name LIKE name', {name})
            .orderBy('tag.id', 'DESC')
            .getMany();
    }

    async getTagsWithProblemId(problemId: number): Promise<Tag[]> {
        return this.problemRepository.createQueryBuilder('p')
            .select('t_tag.*')
            .leftJoin('t_tag', '`t_problem_tag`.`tagId` = `t_tag`.`id`')
            .where('`t_problem_tag`.`problemId` = :problemId', {problemId})
            .getRawMany();
    }
}