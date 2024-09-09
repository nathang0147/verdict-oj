import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { TestcaseModule } from '@modules/testcase/testcase.module';
import { SubmissionModule } from '@modules/submission/submission.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Problem} from "@modules/problem/entities/problem.entity";
import {ProblemRepository} from "@repositories/problem.repository";
import { ProblemTagModule } from '@modules/problem-tag/problem-tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Problem]), ProblemTagModule],
  controllers: [ProblemController],
  providers: [ProblemService, {provide: 'ProblemRepositoryInterface', useClass: ProblemRepository}],
  exports: [ProblemService, TypeOrmModule.forFeature([Problem])],
})
export class ProblemModule {}
