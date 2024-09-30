import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables, JudgerConfig} from "@configs/env/configuration.config";
import {checkExistFolder} from "../../common/common.function";
import * as fs from "fs";
import {Problem} from "@modules/index/entities/problem.entity";
import {Submission} from "@modules/index/entities/submission.entity";
import {Testcase} from "@modules/index/entities/testcase.entity";
import path from "node:path";
import {Injectable, Logger} from "@nestjs/common";
import {WorkerInterface} from "@modules/worker/interface/worker.interface";
import {RuntimeException} from "@nestjs/core/errors/exceptions";

@Injectable()
export class Context{
    private readonly logger = new Logger(Context.name);
    private baseDir: string;
    private _worker: WorkerInterface;
    private _submission: Submission;
    private _problem: Problem;
    private _testcases: Testcase[];

    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {
        const judgerConfig = this.configService.get<JudgerConfig>('jugder');
        this.baseDir = judgerConfig.tempDir;
    }

    public process(){
        checkExistFolder(this.baseDir);
        const cwd = path.join(this.baseDir, `${this._submission.getId()}`);
        if(!fs.existsSync(cwd)){
            fs.mkdirSync(cwd, {recursive: true});
        }

        this._worker.save(cwd, this._submission);
        try {
            this._worker.compile(cwd, this._submission);
            this._worker.run(cwd, this._submission, this._testcases, this._problem);
        }catch (e){
            throw new RuntimeException(e);
        }
        finally {
            try {
                fs.rmdirSync(cwd);
            }catch (e){
                if(e instanceof Error) {
                    this.logger.error(e.message);
                }
            }
        }
    }


    set worker(worker: WorkerInterface) {
        this._worker = worker;
    }

    set submission(submission: Submission) {
        this._submission = submission;
    }

    set problem(problem: Problem) {
        this._problem = problem;
    }

    set testcases(testcases: Testcase[]) {
        this._testcases = testcases;
    }

    get getSubmission(): Submission {
        return this._submission;
    }
}