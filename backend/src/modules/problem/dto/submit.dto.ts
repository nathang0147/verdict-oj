import {SubmissionLanguage} from "@modules/submission/entities/enum/submission.enum";
import {IsNotEmpty} from "class-validator";


export class SubmitDto {
    @IsNotEmpty()
    problemId: number;
    @IsNotEmpty()
    language: number;
    @IsNotEmpty()
    code: string;
}