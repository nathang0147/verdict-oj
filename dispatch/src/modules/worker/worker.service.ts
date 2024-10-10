import {Injectable, Logger} from '@nestjs/common';
import {WorkerInterface} from "@modules/worker/interface/worker.interface";
import {Problem} from '@modules/index/entities/problem.entity';
import {Submission} from '@modules/index/entities/submission.entity';
import {Testcase} from '@modules/index/entities/testcase.entity';
import * as path from "node:path";
import * as fs from "fs";
import {EnvironmentVariables, JudgerConfig} from "@configs/env/configuration.config";
import {ConfigService} from "@nestjs/config";
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
        this.fileName = this.configService.get<JudgerConfig>('jugder')?.tempFileName
        this.logger.log(`JSWorkerService initialized with fileName: ${this.fileName}`);
    }

    async save(cwd: string, submission: Submission): Promise<void> {
        const filePath = path.join(cwd, this.fileName + '.js');
        this.logger.log(`Saving file at: ${filePath}`);
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
        const memoryStart = process.memoryUsage().heapUsed;

        for (let testcase of testcases) {
            const input = this.parseInput(testcase.input);
            const expectedOutput = testcase.output;
            const filePath = path.join(cwd, this.fileName + '.js');
            const startTime = process.hrtime.bigint();

            const isolate = new ivm.Isolate({
                memoryLimit: problem.memoryLimit,
            });
            let context;
            let script;

            try {
                // Create context
                context = await isolate.createContext();
                const jail = context.global;
                await jail.set('global', jail.derefInto());
                await jail.set('log', (message: string) => console.log(message), {reference: true});

                // Read and compile the script
                const code = fs.readFileSync(filePath, 'utf-8');
                script = await isolate.compileScript(code);
                await script.run(context);
            } catch (error) {
                submission.status = SubmissionStatus.STATUS_COMPILATION_ERROR;
                submission.error = 'Compilation Error: ' + error.message;
                this.logger.warn('Compilation Error: ' + error.message);
                return;
            }

            // Memory monitoring variables
            let memoryLimitExceeded = false;
            const memoryCheckInterval = 20; // Check memory usage every 20ms
            // Start a memory monitoring interval
            const memoryMonitor = setInterval(async () => {
                const memoryUsage = await isolate.getHeapStatistics();
                const usedMemoryMB = memoryUsage.total_heap_size / (1024 * 1024);

                if (usedMemoryMB > problem.memoryLimit * 0.8) { // If memory exceeds 80% of the limit, flag it
                    memoryLimitExceeded = true;
                    clearInterval(memoryMonitor);
                    throw new Error('Memory limit exceeded before OOM');
                }
            }, memoryCheckInterval);

            try {
                const fnName = problem.methodName;
                const call = `${fnName}(${input.map(arg => JSON.stringify(arg)).join(',')})`;

                // Running the function inside evalSync
                const result = context.evalSync(`${call} === undefined ? null : ${call}.toString()`, {timeout: problem.runtimeLimit});
                clearInterval(memoryMonitor); // Clear the interval if successful

                const endTime = process.hrtime.bigint();
                const cost = Number(endTime - startTime) / 1000000; // convert to ms
                totalCost += cost;

                if (!this.compareResults(result, expectedOutput)) {
                    submission.status = SubmissionStatus.STATUS_WRONG_ANSWER;
                    submission.error = 'Wrong Answer';
                    submission.input = JSON.stringify(input);
                    submission.output = JSON.stringify(result);
                    submission.expectedOutput = JSON.stringify(expectedOutput);
                    this.logger.warn('Wrong Answer');
                    return;
                }
            } catch (error) {
                memoryLimitExceeded = false;
                clearInterval(memoryMonitor); // Clear the interval if error
                this.handleRunError(error, submission);
                return; // Exit if error occurred
            } finally {
                // Cleanup resources
                if (script) script.release();
                if (context) context.release();
                isolate.dispose();
            }
        }

        // Calculate memory usage
        const memoryEnd = process.memoryUsage().heapUsed;
        const memoryUsed = Math.abs(memoryEnd - memoryStart);
        submission.memory = Math.round((memoryUsed / (1024 * 1024)) * 100) / 100;
        submission.runtime = Math.round(totalCost * 100) / 100;
        submission.status = SubmissionStatus.STATUS_ACCEPTED;
    }

// Improved error handling for run method
    private handleRunError(error: Error, submission: Submission) {
        if (error.message.includes('Timeout')) {
            submission.status = SubmissionStatus.STATUS_TIME_LIMIT_EXCEEDED;
            submission.error = 'Time limit exceeded';
        } else if (error.message.includes('heap out of memory') || error.message.includes('Allocation failed')) {
            submission.status = SubmissionStatus.STATUS_MEMORY_LIMIT_EXCEEDED;
            submission.error = 'Memory limit exceeded';
        } else if (error.message.includes('Runtime')) {
            submission.status = SubmissionStatus.STATUS_RUNTIME_ERROR;
            submission.error = 'Runtime Error';
        } else if (error.message.includes('Wrong Answer')) {
            submission.status = SubmissionStatus.STATUS_WRONG_ANSWER;
            submission.error = 'Wrong Answer';
        } else {
            submission.status = SubmissionStatus.STATUS_INTERNAL_ERROR;
            submission.error = 'Internal error';
            this.logger.warn('Internal Error: ' + error.message);
        }
    }

// parseInput method remains the same


    // Improved comparison method
    private compareResults(result: any, expected: any): boolean {
        const normalizedExpected = expected !== undefined && expected !== null ? expected.toString().trim().replace(/\s+/g, '') : expected;
        const normalizedResult = result !== undefined && result !== null ? result.toString().trim().replace(/\s+/g, '') : result;

        // Check if one is null and the other is the string "null"
        if ((normalizedResult === null && normalizedExpected === 'null') || (normalizedResult === 'null' && normalizedExpected === null)) {
            return true;
        }

        if (normalizedResult === null && normalizedExpected === null) {
            return true;
        }
        if (normalizedResult === null || normalizedExpected === null) {
            return false;
        }
        if (Array.isArray(normalizedResult) && Array.isArray(normalizedExpected)) {
            return normalizedResult.length === normalizedExpected.length && normalizedResult.every((value, index) => this.compareResults(value, normalizedExpected[index]));
        } else if (typeof normalizedResult === 'object' && typeof normalizedExpected === 'object') {
            return JSON.stringify(normalizedResult) === JSON.stringify(normalizedExpected);  // Deep compare
        }
        return normalizedResult === normalizedExpected;
    }

    private parseInput(rawInput: string) {
        const argumentPattern = /\[.*?\]|\{.*?\}|".*?"|\d+/g;
        const matches = rawInput.match(argumentPattern);

        if (!matches) {
            throw new Error("Invalid input format");
        }

        const parsedArguments = matches.map((arg: any) => {
            arg = arg.trim(); // Trim whitespace

            // If it's a JSON structure (array or object), parse it
            if (arg.startsWith('[') || arg.startsWith('{')) {
                return JSON.parse(arg); // Parse arrays and objects
            }

            // If it's a number, convert it to a number type, but check if it's a string number
            if (!isNaN(arg) && !isNaN(parseFloat(arg))) {
                return Number(arg); // Convert to number if it's numeric
            }

            // If it's a string wrapped in quotes, remove quotes and return the string
            if (arg.startsWith('"') && arg.endsWith('"')) {
                return arg.slice(1, -1); // Remove the surrounding quotes
            }

            // Otherwise, return it as-is (for strings or unwrapped text)
            return arg;
        });

        console.log('Parsed arguments: ', parsedArguments);
        return parsedArguments;
    }
}
