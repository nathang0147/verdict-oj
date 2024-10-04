import {Submission} from "@modules/index/entities/submission.entity";
import {Problem} from "@modules/index/entities/problem.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";

export interface WorkerInterface{
    save(cwd: string, submission: Submission): Promise<void>;

    compile(cwd: string, submission: Submission): void;

    run(cwd: string, submission: Submission, testcase: Testcase[], problem: Problem): Promise<void>;
}