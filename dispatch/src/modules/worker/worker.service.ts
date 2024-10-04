import {Injectable, Logger} from '@nestjs/common';
import {WorkerInterface} from "@modules/worker/interface/worker.interface";
import {Problem} from '@modules/index/entities/problem.entity';
import {Submission} from '@modules/index/entities/submission.entity';
import {Testcase} from '@modules/index/entities/testcase.entity';
import * as path from "path";
import {EnvironmentVariables, JudgerConfig} from "@configs/env/configuration.config";
import {ConfigService} from "@nestjs/config";
import * as fs from "fs";
import {SubmissionLanguage, SubmissionStatus} from "@modules/index/entities/enum/submission.enum";
import * as process from "node:process";
import {RuntimeException} from "@nestjs/core/errors/exceptions";

const ivm = require('isolated-vm');

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
        const filePath = path.join(cwd, this.fileName + '.js');
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
        const maxConcurrency = 5; // Adjust based on resource constraints
        const queue = testcases.slice(); // Testcase queue to handle concurrency
        const memoryStart = process.memoryUsage().heapUsed;

        const processTestCase = async (testcase: Testcase) => {
            const input = JSON.parse(testcase.input); // Parse input as JS object
            const expectedOutput = JSON.parse(testcase.output); // Parse expected output

            const filePath = path.join(cwd, this.fileName + '.js');
            const startTime = process.hrtime.bigint();

            // 1. Create the isolate with memory limit
            const isolate = new ivm.Isolate({ memoryLimit: problem.memoryLimit });
            const context = await isolate.createContext();
            const jail = context.global;

            // 2. Set up the global 'jail' and attach a function to be called later
            await jail.set('global', jail.derefInto());
            await jail.set('log', (message: string) => console.log(message), { reference: true });

            // 3. Compile the user's code (it should define a function, like 'solve')
            const code = fs.readFileSync(filePath, 'utf-8');

            let script;
            try {
                script = await isolate.compileScript(code);
            }catch (error){
                submission.status = SubmissionStatus.STATUS_COMPILATION_ERROR;
                submission.error = error.message;
                this.logger.warn('Compilation Error: ' + error.message);
                return submission;
            }

            try {

                // 4. Run the compiled script in the isolate's context
                await script.run(context);

                // 5. Use 'eval' to call the untrusted function with input and get result
                const fnName = problem.methodName; // Assume the function name is known
                const functionHandle = await jail.get(fnName, { reference: true });

                if (!functionHandle) {
                    throw new Error(`Function "${fnName}" not found in the script.`);
                }

                console.log('Input: ' + JSON.stringify(input));

                const result = await functionHandle.apply(jail, input, { timeout: problem.runtimeLimit });

                // Measure the runtime
                const endTime = process.hrtime.bigint();
                const cost = Number(endTime - startTime) / 1000000; // Convert to milliseconds
                totalCost += cost;

                // 6. Check if the result matches the expected output
                if (!this.compareResults(result, expectedOutput)) {
                    submission.input = JSON.stringify(input);
                    submission.output = JSON.stringify(result);
                    submission.expectedOutput = JSON.stringify(expectedOutput);
                    this.logger.warn('Input: ' + JSON.stringify(input));
                    this.logger.warn('Output: ' + JSON.stringify(result));
                    this.logger.warn('Expected Output: ' + JSON.stringify(expectedOutput));
                    throw new Error('Wrong Answer');
                }
            } catch (error) {
                // 7. Handle errors for timeout, memory, and other runtime issues
                if (error.message.includes('Timeout')) {
                    submission.status = SubmissionStatus.STATUS_TIME_LIMIT_EXCEEDED;
                    submission.error = 'Time limit exceeded';
                    this.logger.warn('Timeout Error: ' + error.message);
                    return submission;
                } else if (error.message.includes('Memory')) {
                    submission.status = SubmissionStatus.STATUS_MEMORY_LIMIT_EXCEEDED;
                    submission.error = 'Memory limit exceeded';
                    this.logger.warn('Memory Limit Error: ' + error.message);
                    return submission;
                } else if (error.message.includes('Runtime')) {
                    submission.status = SubmissionStatus.STATUS_RUNTIME_ERROR;
                    submission.error = error.message;
                    this.logger.warn('Runtime Error: ' + error.message);
                    return submission;
                } else if(error.message.includes('Wrong Answer')) {
                    submission.status = SubmissionStatus.STATUS_WRONG_ANSWER;
                    submission.error = 'Wrong Answer';
                    this.logger.warn('Wrong Answer: ' + error.message);
                    return submission;
                } else if (error.message.includes('Interval')) {
                    submission.status = SubmissionStatus.STATUS_INTERNAL_ERROR;
                    submission.error = 'Interval error';
                    this.logger.warn('Interval Error: ' + error.message);
                    return submission;
                }
                throw new RuntimeException("Abused execute: " + error.message);
            } finally {
                // 8. Clean up
                script.release();
                context.release();
                isolate.dispose();
            }
        }

        // Execute testcases with concurrency control
        const runTestCasesConcurrently = async () => {
            const workers = [];
            while (queue.length && workers.length < maxConcurrency) {
                const testcase = queue.shift();
                workers.push(processTestCase(testcase));
            }
            await Promise.all(workers);
        };

        await runTestCasesConcurrently();

        const memoryEnd = process.memoryUsage().heapUsed;
        submission.memory = (memoryEnd - memoryStart) / (1024 * 1024); // Memory used in MB
        submission.runtime = totalCost;
        submission.status = SubmissionStatus.STATUS_ACCEPTED;
    }

    // Improved comparison method
    compareResults(result: any, expected: any): boolean {
        if (Array.isArray(result) && Array.isArray(expected)) {
            return result.length === expected.length && result.every((value, index) => this.compareResults(value, expected[index]));
        } else if (typeof result === 'object' && typeof expected === 'object') {
            return JSON.stringify(result) === JSON.stringify(expected);  // Deep compare
        }
        return result === expected;
    }

}
