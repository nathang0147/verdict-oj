import {CreateTagDto} from "@modules/problem-tag/dto/create.tag.dto";
import {PartialType} from "@nestjs/swagger";

export class UpdateTagDto extends PartialType(CreateTagDto) {
    id: number
}