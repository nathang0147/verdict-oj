import {ApiProperty} from "@nestjs/swagger";
import {IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class FindDto {
    @ApiProperty()
    @IsInt()
    @Min(-1)
    @Max(1000)
    @Type(() => Number)
    skip: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    limit: number;
}