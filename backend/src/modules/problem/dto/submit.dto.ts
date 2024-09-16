import {SubmissionLanguage} from "@modules/submission/entities/enum/submission.enum";
import {IsNotEmpty} from "class-validator";


export class SubmitDto {
    @IsNotEmpty()
    userId: string;
    @IsNotEmpty()
    problemId: number;
    @IsNotEmpty()
    language: SubmissionLanguage;
    @IsNotEmpty()
    code: string;
}