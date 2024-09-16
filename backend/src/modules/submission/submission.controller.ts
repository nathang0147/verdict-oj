import {Body, Controller, Get, Param, Query, Req, Res} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import {Request} from "express";
import {ConfigService} from "@nestjs/config";

@Controller('submission')
export class SubmissionController {
  constructor(
      private readonly submissionService: SubmissionService,
      private readonly configService: ConfigService
  ) {}

  @Get('/page')
  getSubmissionList(@Param('page') page: number|1) {
    return this.submissionService.getSubmissionsList(page);
  }

  @Get('/problem')
  getSubmissionListByProblemId(@Body() problemId: number, @Param('page') page: number|1) {
    return this.submissionService.getSubmissionListByProblemId(problemId, page);
  }

  @Get()
  getSubmissionAndProblem(@Query('id') id: number) {
    try{
        return this.submissionService.getSubmissionAndProblem(id);
    }catch (e){
        return e.message;
    }
  }

  @Get('/total')
  getTotalSubmissionsAndPaginate(
      @Body() page: number,
  ) {
    return this.submissionService.getSubmissionPagination(page, this.configService.get('PAGINATION_PER_PAGE'));
  }
}
