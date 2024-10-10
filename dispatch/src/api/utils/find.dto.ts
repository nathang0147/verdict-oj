import {ApiProperty} from "@nestjs/swagger";
import {IsInt, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {FindManyOptions, FindOptionsRelations} from "typeorm";

export class FindDto<T> {
    @ApiProperty()
    @IsInt()
    @Min(-1)
    @Max(1000)
    @Type(() => Number)
    limit?: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @ApiProperty()
    @Type(() => Object)
    relations?: string[] | FindOptionsRelations<T>;

    @ApiProperty()
    @Type(() => String)
    select?: (keyof T)[]
}