import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Problem} from "@modules/index/entities/problem.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";
import {Submission} from "@modules/index/entities/submission.entity";
import {ProblemService, SubmissionService, TestcaseService} from "../../services/index.service";
import {ProblemRepository, SubmissionRepository, TestcaseRepository} from "@repositories/index.repository";

@Module({
  imports: [
      TypeOrmModule.forFeature([Problem, Testcase, Submission])
  ],
  controllers: [IndexController],
  providers: [
      IndexService,
      ProblemService,
      SubmissionService,
      TestcaseService,
      SubmissionRepository,
      ProblemRepository,
      TestcaseRepository
  ],
  exports: [
      IndexService,
      ProblemService,
      SubmissionService,
      TestcaseService,
      SubmissionRepository,
      ProblemRepository,
      TestcaseRepository,
      TypeOrmModule.forFeature([Problem, Testcase, Submission])
  ]
})
export class IndexModule {}
