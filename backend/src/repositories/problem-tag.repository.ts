import {Injectable} from "@nestjs/common";
import {BaseRepositoryAbstract} from "@repositories/base/base.abstract.repository";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import { ProblemTagRepositoryInterface} from "@modules/problem-tag/interface/problem-tag.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ProblemTagRepository
    extends BaseRepositoryAbstract<ProblemTag>
    implements ProblemTagRepositoryInterface{

    constructor(
        @InjectRepository(ProblemTag)
        private readonly problemTagRepository: Repository<ProblemTag>
    ) {
        super(problemTagRepository);
    }
}