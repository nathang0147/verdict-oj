import {ClassSerializerInterceptor, Controller, Get, Post, Query, Req, UseInterceptors} from '@nestjs/common';
import { ProblemService } from './problem.service';
import {Request} from "express";

@Controller('problem')
@UseInterceptors(ClassSerializerInterceptor)
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  async getProblemsWithStatus(@Req() req: any, @Query('offset') offset: number, @Query('limit') limit: number) {
    const userId = req.user.id;
    return this.problemService.getProblemsWithStatus(userId,{offset, limit} );
  }
}
