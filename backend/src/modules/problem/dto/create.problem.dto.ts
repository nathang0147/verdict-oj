import {IsNotEmpty, MaxLength} from "class-validator";

export class CreateProblemDto{

    @IsNotEmpty()
    @MaxLength(50)
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly sampleInput: string;

    @IsNotEmpty()
    readonly sampleOutput: string;

    @IsNotEmpty()
    readonly difficulty: number;

    @IsNotEmpty()
    readonly runtimeLimit: number;

    @IsNotEmpty()
    readonly memoryLimit: number;

    @IsNotEmpty()
    readonly hint: string;
}