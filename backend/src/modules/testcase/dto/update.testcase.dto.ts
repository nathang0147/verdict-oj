import {CreateTestcaseDto} from "@modules/testcase/dto/create.testcase.dto";
import {PartialType} from "@nestjs/swagger";

export class UpdateTestcaseDto extends PartialType(CreateTestcaseDto) {}