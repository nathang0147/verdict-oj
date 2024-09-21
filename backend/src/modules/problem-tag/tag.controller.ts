import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Patch,
    Post,
    Query
} from "@nestjs/common";
import {TagService} from "@modules/problem-tag/tag.service";
import Role from "@modules/authorization/contrants/role.enum";
import {Roles} from "../../decorators/roles.decorator";
import {UpdateTagDto} from "@modules/problem-tag/dto/update.tag.dto";
import {ProblemTagService} from "@modules/problem-tag/problem-tag.service";
import {CreateProblemTagDto} from "@modules/problem-tag/dto/create.problem-tag.dto";

@Roles(Role.ADMIN)
@Controller('tag')
export class TagController {
    constructor(
        private readonly tagService: TagService,
        private readonly problemTagService: ProblemTagService
    ) {}

    @Roles(Role.USER)
    @Get()
    getAllTags() {
        return this.tagService.getTags();
    }

    @Post('create')
    addTag(@Body() name: string) {
        try{
            return this.tagService.addTag(name);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error creating tag',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('add')
    addTagToProblem(@Body() createProblemTagDto: CreateProblemTagDto) {
        try{
            return this.problemTagService.addProblemTag(createProblemTagDto);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error adding tag to problem',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('edit')
    editTag(@Query('id') tagId: number){
        return this.tagService.getTagById(tagId)
    }

    @Patch('update')
    updateTag(@Body() updateTagDto: UpdateTagDto) {
        try{
            const tagExists = this.tagService.getTagById(updateTagDto.id);
            if(!tagExists){
                throw new NotFoundException('Tag not found');
            }
            return this.tagService.update(updateTagDto.id, updateTagDto);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error updating tag',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete()
    deleteTag(@Body() id: number) {
        try{
            return this.tagService.delete(id);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error deleting tag',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('remove_tag')
    removeTagFromProblem(@Body() problemTagId : number){
        try {
            return this.problemTagService.deleteProblemTag(problemTagId);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error removing tag from problem',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

}