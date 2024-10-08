import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus, NotFoundException,
    Param,
    Patch,
    Post,
    PreconditionFailedException,
    Query
} from "@nestjs/common";
import {ProblemService} from "@modules/problem/problem.service";
import {TagService} from "@modules/problem-tag/tag.service";
import {Roles} from "../../decorators/roles.decorator";
import Role from "@modules/authorization/contrants/role.enum";
import {CreateProblemDto} from "@modules/problem/dto/create.problem.dto";
import {UpdateProblemDto} from "@modules/problem/dto/update.problem.dto";
import {CreateProblemTagDto} from "@modules/problem-tag/dto/create.problem-tag.dto";
import {ProblemTagService} from "@modules/problem-tag/problem-tag.service";
import {SearchTestcaseDto} from "@modules/testcase/dto/search.testcase.dto";
import {TestcaseService} from "@modules/testcase/testcase.service";
import {CreateTestcaseDto} from "@modules/testcase/dto/create.testcase.dto";
import {UpdateTestcaseDto} from "@modules/testcase/dto/update.testcase.dto";

@Roles(Role.ADMIN)
@Controller('admin/problem')
export class AdminProblemController {

    constructor(
        private readonly problemService: ProblemService,
        private readonly tagService: TagService,
        private readonly problemTagService: ProblemTagService,
        private readonly testcaseService: TestcaseService
    ) {}

    @Get()
    index(@Body() {id, title}: { id?: string,  title?: string}) {
        return this.problemService.searchProblems(id, title);
    }

    @Post('create')
    createProblem(@Body() createProblemDto: CreateProblemDto) {
        return this.problemService.create(createProblemDto)
    }

    @Post('update/:id')
    updateProblem(@Body() updateProblemDto : UpdateProblemDto, @Param('id') id: number) {
        return this.problemService.update(id, updateProblemDto)
    }

    @Post('delete/:id')
    deleteProblem(@Param('id') id: number) {
        return this.problemService.remove(id)
    }

    @Get('/tag')
    indexTag(@Query('problemId') id: number) {
        try {
            const tags = this.tagService.getTags();
            const problems = this.problemService.findOne(id);
            const problemTags = this.tagService.getTagsWithProblemId(id);

            return {tags, problems, problemTags};
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error getting tags',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('tag/add')
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

    @Delete('tag/remove')
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

    @Get('/testcase')
    indexTestcase(@Body() {input, output}: {input?:string, output?: string}, @Query('problemId') problemId: number) {
        try{
            return this.problemService.searchTestcasesByProblemId(problemId, input, output)
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error searching testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('testcase/add')
    async addTestcaseToProblem(@Body('testcase') createTestcaseDto: CreateTestcaseDto[], @Body('problemId') problemId: number) {
        if(!problemId){
            throw new PreconditionFailedException('Problem id is required');
        }

        const problem = this.problemService.findOne(problemId);
        if(!problem){
            throw new NotFoundException(`Problem with id: ${problemId} not found`);
        }

        const result =[];

        for(let testcase of createTestcaseDto){
            try{
                const newTestcase = await this.testcaseService.addTestcase(problemId, testcase);
                 result.push(newTestcase);
            }catch (e){
                result.push( new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error adding testcase to problem',
                    message: e.message,
                }, HttpStatus.BAD_REQUEST)
            )
            }
        }

        return result;

    }

    @Get('testcase/edit/:id')
    editTestcase(@Param('id') testcaseId: number){
        try{
            return this.testcaseService.findOne(testcaseId);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error getting testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('testcase/update/:id')
    updateTestCase(@Body() updateTestcaseDto: UpdateTestcaseDto, @Param('id') testcaseId: number) {
        if(!testcaseId){
            throw new PreconditionFailedException('Testcase id is required');
        }
        const testcase = this.testcaseService.findOne(testcaseId);
        if(!testcase){
            throw new NotFoundException(`Testcase with id: ${testcaseId} not found`);
        }
        try{
            return this.testcaseService.update(testcaseId,updateTestcaseDto)
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error updating testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('testcase/delete/:id')
    deleteTestcase(@Param('id') testcaseId: number) {
        if(!testcaseId){
            throw new PreconditionFailedException('Testcase id is required');
        }
        try{
            return this.testcaseService.remove(testcaseId);
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error deleting testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }


}