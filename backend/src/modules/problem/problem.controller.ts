import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get, Param,
    Post,
    Query,
    Req,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
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
import {ProblemExistsFilterPipe} from "../../pipe/problemExistsFilter.pipe";
import {ConditionPagination} from "../../common/common.type";
import {SubmissionService} from "@modules/submission/submission.service";
import {calculatePagination} from "../../common/common.function";
import {Throttle} from "@nestjs/throttler";

@Controller('problem')
@UseInterceptors(ClassSerializerInterceptor)
export class ProblemController {
    constructor(
        private readonly problemService: ProblemService,
        private readonly tagService: TagService,
        private readonly submissionService: SubmissionService
    ) {
    }

    @Get()
    index(
        @Body('id') id: string,
        @Body('title') title: string
    ) {
        return this.problemService.searchProblems(id, title);
    }

    @UsePipes(ProblemExistsFilterPipe)
    @Get('/:id')
    getProblemsWithTags(@Param() problemId: number) {
        try {
            const problem = this.problemService.findOne(problemId)
            return {
                problem,
                tags: this.tagService.getTagsWithProblemId(problemId)
            }
        } catch (e) {
            return e;
        }
    }

    @Get('search/:id')
    getProblems(@Param() problemId: number) {
        try {
            const problem = this.problemService.findOne(problemId);
            const tags = this.tagService.getTagsWithProblemId(problemId);
            if (!problem) {
            }

            return {problem, tags};
        } catch (e) {
            throw e;
        }
    }

    @Get('status')
    getProblemsWithStatus(
        @Req() req: any,
        @Body() {offset, limit}: ConditionPagination
    ) {
        const userId = req.user.id;
        return this.problemService.getProblemsWithStatus(userId, {offset, limit});
    }

    @Throttle({
        short: { limit: 5, ttl: 1000 },
        long: { limit: 10, ttl: 60000 },
    })
    @Post('submit')
    submit(
        @Req() req: any,
        @Body() submitDto: SubmitDto
    ) {
        const userId = req.user.id;
        return this.problemService.submit(userId,submitDto);
    }

    @UsePipes(ProblemExistsFilterPipe)
    @Get('submission')
    async getSubmission(
        @Query('problemId') problemId: number,
        @Body('page') page: number | 1
    ) {
        const problem = await this.problemService.findOne(problemId)
        const submissionsCount = await this.submissionService.getTotalSubmissionsCountByProblemId(problemId);
        const submissionsList = await this.submissionService.getSubmissionListByProblemId(problemId, page);

        return {
            'problem': problem,
            'pagination': calculatePagination(submissionsCount, page),
            'submissionsCount': submissionsCount,
            'submissionsList': submissionsList
        }
    }

}
