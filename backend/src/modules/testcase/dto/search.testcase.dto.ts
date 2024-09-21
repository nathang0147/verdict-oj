import {PartialType} from "@nestjs/swagger";
import {CreateTestcaseDto} from "@modules/testcase/dto/create.testcase.dto";

export class SearchTestcaseDto extends PartialType(CreateTestcaseDto) {
    problemId: number;
    input?: string;
    output?: string;
}