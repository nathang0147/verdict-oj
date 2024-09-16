import {Body, ClassSerializerInterceptor, Controller, Get, Post, Query, Req, UseInterceptors} from '@nestjs/common';
import {ProblemService} from './problem.service';
import {Request} from "express";
import {RoleGuard} from "@modules/authorization/guard/role.guard";
import Role from "@modules/authorization/contrants/role.enum";
import {Roles} from "../../decorators/roles.decorator";
import * as wasi from "node:wasi";
import {TagService} from "@modules/problem-tag/tag.service";
import {CreateProblemDto} from "@modules/problem/dto/create.problem.dto";
import {UpdateProblemDto} from "@modules/problem/dto/update.problem.dto";
import {SubmitDto} from "@modules/problem/dto/submit.dto";

@Controller('problem/')
@UseInterceptors(ClassSerializerInterceptor)
export class ProblemController {
    constructor(
        private readonly problemService: ProblemService,
        private readonly tagService: TagService
    ) {
    }

    @Get()
    getProblemsWithStatus(@Req() req: any, @Query('offset') offset: number, @Query('limit') limit: number) {
        const userId = req.user.id;
        return this.problemService.getProblemsWithStatus(userId, {offset, limit});
    }

    @Get('existsFilter')
    existsFilter(@Query('problemId') problemId: number) {
        try {
            if(!problemId) {
                throw new Error('Problem id is required');
            }
            return this.problemService.findOne(problemId);
        }catch (e) {
            return e;
        }
    }

    @Get('problem&tags')
    getProblemsWithTags(@Query('problemId') problemId: number) {
        try{
            if(!problemId) {
                throw new Error('Problem id is required');
            }

            return{
                problem: this.problemService.findOne(problemId),
                tags: this.tagService.getTagsWithProblemId(problemId)
            }
        }catch (e) {
            return e;
        }
    }


    //Chua tao submitDto
    @Post('submit')

    submit(@Req() req: any, @Body() submitDto: SubmitDto) {
        submitDto.userId = req.user.id;
        return this.problemService.submit(submitDto);
    }

    @Roles(Role.ADMIN)
    @Post('create')
    createProblem(@Body() createProblemDto: CreateProblemDto) {
        return this.problemService.create(createProblemDto)
    }

    @Roles(Role.ADMIN)
    @Post('update')
    updateProblem(@Body() updateProblemDto : UpdateProblemDto, @Query('id') id: number) {
        return this.problemService.update(id, updateProblemDto)
    }

    @Roles(Role.ADMIN)
    @Post('delete')
    deleteProblem(@Query('id') id: number) {
        return this.problemService.remove(id)
    }
}
