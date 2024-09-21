import {Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Query} from "@nestjs/common";
import {TestcaseService} from "@modules/testcase/testcase.service";
import {CreateTestcaseDto} from "@modules/testcase/dto/create.testcase.dto";
import Role from "@modules/authorization/contrants/role.enum";
import {Roles} from "../../decorators/roles.decorator";
import {SearchTestcaseDto} from "@modules/testcase/dto/search.testcase.dto";
import {UpdateTestcaseDto} from "@modules/testcase/dto/update.testcase.dto";
import {ProblemService} from "@modules/problem/problem.service";

@Roles(Role.ADMIN)
@Controller('testcase')
export class TestcaseController {
    constructor(
        private readonly testcaseService: TestcaseService,
        private readonly problemService: ProblemService
    ) {}
    
    @Post('create')
    addTestCase(@Body() createTestcaseDto: CreateTestcaseDto) {
        try{
            if(createTestcaseDto){
                return this.testcaseService.create(createTestcaseDto);
            }
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error creating testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('search')
    searchTestcasesByProblemId(@Body() searchDT0:SearchTestcaseDto) {
        try{
            return this.problemService.searchTestcasesByProblemId(searchDT0.problemId, searchDT0.input, searchDT0.output)
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error searching testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch()
    updateTestCase(@Body() updateTestcaseDto: UpdateTestcaseDto, @Query('id') id: number) {
        try{
            return this.testcaseService.update(id,updateTestcaseDto)
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error updating testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete()
    deleteTestCase(@Query('id') id: number) {
        try{
            return this.testcaseService.delete(id)
        }catch (e){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Error deleting testcase',
                message: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}