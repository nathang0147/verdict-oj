import {
    ArgumentMetadata,
    Injectable,
    NotFoundException,
    PipeTransform,
    PreconditionFailedException,
    Query
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {Repository} from "typeorm";

@Injectable()
export class ProblemExistsFilterPipe implements PipeTransform {
    constructor(
        @InjectRepository(Problem)
        private readonly problemRepository: Repository<Problem>
    ) {
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            await this.validateProblemExists(value.id);
        } else if (metadata.type === 'query') {
            await this.validateProblemExists(value.problemId);
        }
        return value;
    }

    async validateProblemExists(problemId: number) {
        if (!problemId) {
            throw new PreconditionFailedException(`Param problemId is required`);
        }

        const problem = await this.problemRepository.findOne({
            where: {id: problemId}
        })

        if (!problem) {
            throw new NotFoundException(`Problem with id ${problemId} not found`);
        }
    }
}