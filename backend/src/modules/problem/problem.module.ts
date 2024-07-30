import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { TestcaseModule } from './testcase/testcase.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  controllers: [ProblemController],
  providers: [ProblemService],
  imports: [TestcaseModule, SubmissionModule],
})
export class ProblemModule {}
