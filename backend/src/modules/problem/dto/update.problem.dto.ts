import {CreateProblemDto} from "@modules/problem/dto/create.problem.dto";
import {PartialType} from "@nestjs/swagger";

export class UpdateProblemDto extends PartialType(CreateProblemDto) {}