import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {ProblemService} from "@modules/problem/problem.service";
import {TagService} from "@modules/problem-tag/tag.service";
import {Roles} from "../../decorators/roles.decorator";
import Role from "@modules/authorization/contrants/role.enum";
import {CreateProblemDto} from "@modules/problem/dto/create.problem.dto";
import {UpdateProblemDto} from "@modules/problem/dto/update.problem.dto";

@Roles(Role.ADMIN)
@Controller('admin/problem')
export class AdminProblemController {

    constructor(
        private readonly problemService: ProblemService,
        private readonly tagService: TagService
    ) {}

    @Get()
    index(@Query('id') id: string, title: string){
        return this.problemService.searchProblems(id, title);
    }

    @Post('create')
    createProblem(@Body() createProblemDto: CreateProblemDto) {
        return this.problemService.create(createProblemDto)
    }

    @Post('update')
    updateProblem(@Body() updateProblemDto : UpdateProblemDto, @Query('id') id: number) {
        return this.problemService.update(id, updateProblemDto)
    }

    @Post('delete')
    deleteProblem(@Query('id') id: number) {
        return this.problemService.remove(id)
    }
}