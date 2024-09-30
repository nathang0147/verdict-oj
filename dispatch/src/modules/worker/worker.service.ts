import {Injectable, Logger} from '@nestjs/common';
import {WorkerInterface} from "@modules/worker/interface/worker.interface";
import {Problem} from '@modules/index/entities/problem.entity';
import {Submission} from '@modules/index/entities/submission.entity';
import {Testcase} from '@modules/index/entities/testcase.entity';
import path from "node:path";
import {EnvironmentVariables, JudgerConfig} from "@configs/env/configuration.config";
import {ConfigService} from "@nestjs/config";
import fs from "fs";
import ivm from 'isolated-vm';
import {execFile, ExecFileOptions} from "child_process";
import {SubmissionStatus} from "@modules/index/entities/enum/submission.enum";
import * as process from "node:process";

@Injectable()
export class JSWorkerService implements WorkerInterface {
    private fileName: string
    private policyFile: string
    private readonly logger = new Logger(JSWorkerService.name)
    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {
        this.fileName = this.configService.get<JudgerConfig>('jugder').tempFileName
    }

    async save(cwd: string, submission: Submission): Promise<void> {
        const filePath = path.join(cwd,this.fileName + '.js');
        fs.writeFileSync(filePath, Buffer.from(submission.code, 'utf-8'));

        this.logger.log(`File saved at ${filePath}`)

        const policyFile = path.join(cwd, 'policy')
        fs.writeFileSync(policyFile, '')
        this.logger.log(`Policy file saved at ${policyFile}`)

    }
    compile(cwd: string, submission: Submission): void {
        this.logger.log('Compile step is a no-op for JavaScript.');
    }

    async run(cwd: string, submission: Submission, testcases: Testcase[], problem: Problem): Promise<void> {
        let totalCost = 0;

        for(const testcase of testcases){
            const input = Buffer.from(testcase.input, 'utf-8');
            const expectedOutput = Buffer.from(testcase.output, 'utf-8');

            const filePath = path.join(cwd, this.fileName + '.js');
            const options: ExecFileOptions = {
                cwd,
                timeout: problem.runtimeLimit,
                maxBuffer: 1024 * 1024, // 1MB buffer for stdout and stderr,
                env:{
                    NODE_OPTIONS: `--max-old-space-size=${problem.memoryLimit*1024}`,
                    PATH: process.env.PATH
                }
            }

            const startTime = process.hrtime.bigint();

            try {
                const result = await new Promise<Buffer>((resolve, reject) => {
                    const isolate = new ivm.Isolate({memoryLimit: problem.memoryLimit})
                    const context = isolate.createContextSync();
                    const jail = context.global;
                    jail.setSync('global', jail.derefInto());

                    const script = isolate.compileScriptSync(fs.readFileSync(filePath, 'utf-8'));
                    const timeout = problem.runtimeLimit;

                    const child = execFile('node', [filePath], options, (error, stdout, stderr) => {
                        if (error) {
                            if (error.killed) {
                                submission.status = SubmissionStatus.STATUS_TIME_LIMIT_EXCEEDED
                                submission.error = 'Time limit Exceeded'
                            } else {
                                submission.status = SubmissionStatus.STATUS_RUNTIME_ERROR
                                submission.error = error.message
                            }
                            this.logger.error('Runtime error: ' + error.message)

                            child.kill(); // Explicitly kill the child process
                            context.release();
                            script.release();
                            isolate.dispose();
                            return reject(new Error('Execution Aborted'))
                        }
                        resolve(Buffer.from(stdout.toString().trim(), 'utf-8'))
                    });

                    child.stdin.write(input);
                    child.stdin.end()

                    script.runSync(context, {timeout})

                    // Cleanup on success
                    script.release();
                    context.release();
                    isolate.dispose();
                })

                const endTime = process.hrtime.bigint();
                const cost = Number(endTime - startTime) / 1000000; // Convert to milliseconds
                totalCost += cost;

                if (!result.equals(expectedOutput)) {
                    submission.status = SubmissionStatus.STATUS_WRONG_ANSWER
                    submission.input = input.toString('utf-8');
                    submission.output = result.toString('utf-8');
                    submission.expectedOutput = expectedOutput.toString('utf-8');
                    this.logger.warn('Input: ' + input);
                    this.logger.warn('Output: ' + result);
                    this.logger.warn('Expected Output: ' + expectedOutput);
                    throw new Error('Wrong Answer');
                }
            }catch (e){
                throw e
            }
        }
        submission.runtime = totalCost;
        submission.memory = process.memoryUsage().heapUsed/(1024*1024); //convert to MB
        submission.status = SubmissionStatus.STATUS_ACCEPTED;
    }

}
