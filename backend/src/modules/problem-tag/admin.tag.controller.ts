import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException, Param,
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
export class AdminTagController {
    constructor(
        private readonly tagService: TagService,
        private readonly problemTagService: ProblemTagService
    ) {}

    @Roles(Role.USER)
    @Get()
    getAllTags() {
        return this.tagService.getTags();
    }

    @Get()
    index(@Body() {id, name}: { id: null,  name: null}) {
        return this.tagService.searchTags(id, name);
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

    @Patch('edit/:id')
    editTag(@Param('id') tagId: number){
        return this.tagService.getTagById(tagId)
    }

    @Patch('update/:id')
    updateTag(@Body() updateTagDto: UpdateTagDto, @Param('id') id: number) {
        try{
            const tagExists = this.tagService.getTagById(id);
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

    @Delete('delete/:id')
    deleteTag(@Param() id: number) {
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

}