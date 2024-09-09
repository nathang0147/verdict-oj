import {Controller, Get, Param, Query, Req, Res} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import {Request} from "express";

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('/page')
  getSubmissionList(@Query('page') page: number|1) {
    return this.submissionService.getSubmissionsList(page);
  }

  @Get('/problem')
  getSubmissionListByProblemId(
      @Req() req: Request , @Query('page') page: number|1) {
    const problemId = req.query.problemId as string;
    return this.submissionService.getSubmissionListByProblemId(problemId, page);
  }

  @Get()
  getSubmissionAndProblem(@Query('id') id: string) {
    try{
        return this.submissionService.getSubmissionAndProblem(id);
    }catch (e){
        return e.message;
    }
  }

  @Get('/total')
  getTotalSubmissionsAndPaginate(
      @Req() req: Request,
      @Param('paginationPerPage') limit: number
  ) {
    const page = parseInt(<string>req.query.page) | 1;
    return this.submissionService.getSubmissionPagination(page, limit);
  }
}
