import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateTestcaseDto {
    @IsNotEmpty()
    input: string;

    @IsNotEmpty()
    output: string;
}