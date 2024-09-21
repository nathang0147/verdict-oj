import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateTestcaseDto {
    @IsNotEmpty()
    @IsNumber()
    problemId: number;

    @IsNotEmpty()
    input: string;

    @IsNotEmpty()
    output: string;
}