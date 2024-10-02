import { Test, TestingModule } from '@nestjs/testing';
import { JSWorkerService } from './worker.service';
import { ConfigService } from '@nestjs/config';
import {SubmissionStatus} from "@modules/index/entities/enum/submission.enum";
import * as fs from 'fs';
import * as path from 'path';
import { execFile } from 'child_process';
import ivm from 'isolated-vm';
import { Logger } from '@nestjs/common';

jest.mock('fs', () => {
  const path = require('path');
  return {
    readFileSync: jest.fn().mockImplementation((notfilePath, encoding) => {
      const filePath = path.normalize(notfilePath);
      if (filePath.includes(path.normalize('1/Main.js'))) {
        return 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) { return [map.get(complement), i]; } map.set(nums[i], i); } }';
      } else if (filePath.includes(path.normalize('2/Main.js'))) {
        return 'function twoSum(nums, target) { throw new Error("Runtime Error"); }';
      } else if (filePath.includes(path.normalize('3/Main.js'))) {
        return 'function twoSum(nums, target) { return [0, 2]; }';
      } else if (filePath.includes(path.normalize('4/Main.js'))) {
        return 'while(true) {}'; // Infinite loop to simulate time limit exceeded
      } else if (filePath.includes(path.normalize('5/Main.js'))) {
        return 'const largeArray = new Array(1e9).fill(0);'; // Large memory allocation to simulate memory limit exceeded
      }
      throw new Error(`File not found: ${filePath}`);
    }),
    writeFileSync: jest.fn().mockImplementation((filePath, data) => {
      console.log(`Mock writeFileSync called with path: ${filePath}`);
    }),
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn().mockImplementation((dirPath) => {
      console.log(`Mock mkdirSync called with path: ${dirPath}`);
    }),
  };
});
jest.mock('child_process', () => {
  return {
    execFile: jest.fn().mockImplementation((cmd, args, options, callback) => {
      const child = {
        stdin: {
          write: jest.fn(),
          end: jest.fn(),
        },
        stdout: {
          on: jest.fn(),
        },
        stderr: {
          on: jest.fn(),
        },
        on: jest.fn(),
      };
      // Simulate successful execution with expected output for two-sum case
      if (args.includes('Main.js')) {
        callback(null, '[0, 1]', ''); // Mock correct result output
      } else {
        callback(new Error('Runtime Error'), '', ''); // Mock runtime error
      }
      return child;
    }),
  };
});

jest.mock('path', () => {
  const originalPath = jest.requireActual('path');
  return {
    ...originalPath,
    join: jest.fn().mockImplementation((...args) => {
      return originalPath.join(...args);
    }),
    normalize: jest.fn().mockImplementation((p) => originalPath.normalize(p)),
    resolve: jest.fn().mockImplementation((...args) => {
      return originalPath.resolve(...args);
    }),
  };
});
jest.mock('isolated-vm', () => {
  return {
    Isolate: jest.fn().mockImplementation(() => ({
      createContext: jest.fn().mockReturnValue({
        global: {
          set: jest.fn(),
          derefInto: jest.fn().mockReturnValue({}),
          get: jest.fn().mockImplementation((fnName) => {
            if (fnName === 'twoSum') {
              return {
                apply: jest.fn().mockImplementation((_, args) => {
                  const [nums, target] = args;
                  const map = new Map();
                  for (let i = 0; i < nums.length; i++) {
                    const complement = target - nums[i];
                    if (map.has(complement)) {
                      return [map.get(complement), i];
                    }
                    map.set(nums[i], i);
                  }
                  return [];
                }),
              };
            }
            // Throw an error if the function doesn't exist
            throw new Error(`Function "${fnName}" not found in the script.`);
          }),
        },
        release: jest.fn(),
      }),
      compileScript: jest.fn().mockImplementation((code) => {
        if (code.includes('while(true) {}')) {
          return {
            run: jest.fn().mockImplementation(() => {
              return new Promise((_, reject) => {
                setTimeout(() => {
                  reject(new Error('Timeout Error: Script execution timed out.'));
                }, 1000);
              });
            }),
            release: jest.fn(),
          };
        } else if (code.includes('const largeArray = new Array(1e9).fill(0);')) {
          return {
            run: jest.fn().mockImplementation(() => {
              throw new Error('Memory Limit Error: Script exceeded memory limit.');
            }),
            release: jest.fn(),
          };
        } else if (code.includes('throw new Error("Runtime Error");')) {
          return {
            run: jest.fn().mockImplementation(() => {
              throw new Error('Runtime Error');
            }),
            release: jest.fn(),
          };
        } else if (code.includes('return [0, 2];')) {
          return {
            run: jest.fn().mockImplementation(() => {
              return Promise.resolve([0,2]) // Mocking a valid result
            }),
            release: jest.fn(),
          };
        } else {
          return {
            run: jest.fn().mockImplementation(() => {
              return Promise.resolve(); // Default successful execution
            }),
            release: jest.fn(),
          };
        }
      }),
      dispose: jest.fn(),
    })),
  };
});


describe('JSWorkerService', () => {
  let service: JSWorkerService;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JSWorkerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({tempFileName: 'Main'}),
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<JSWorkerService>(JSWorkerService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);

    // Mock JSON.parse
    // Mock JSON.parse
    jest.spyOn(JSON, 'parse').mockImplementation((text) => {
      switch (text) {
        case '[2, 7, 11, 15], 9':
          return [[2, 7, 11, 15], 9];
        case '[3, 2, 4], 6':
          return [[3, 2, 4], 6];
        case '[0, 1]':
          return [0, 1];
        case '[1, 2]':
          return [1, 2];
        case '[]':
          return [];
        default:
          throw new SyntaxError('Unexpected non-whitespace character after JSON at position 14');
      }
    });
  })

  it('should save the file and policy file', async () => {
    const cwd = path.join('tmp', '1');
    const submission = { code: 'function twoSum(nums, target) { return []; }' } as any;

    // Mock file paths
    const filePath = path.normalize(path.join(cwd, 'Main.js'));
    const policyFile = path.normalize(path.join(cwd, 'policy'));

    // Call the save method
    await service.save(cwd, submission);

    // Ensure writeFileSync was called for the file and policy file
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, Buffer.from(submission.code, 'utf-8'));
    expect(fs.writeFileSync).toHaveBeenCalledWith(policyFile, '');
  });

  const getTaskResult = async (filePath: string, methodName: string, id: number) => {
    const rootDir = path.resolve(__dirname, '../../../test/Resource/js'); // Adjust the relative path to match your project structure
    const fullPath = path.normalize(path.join(rootDir, filePath));

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    console.log(`File content: ${fileContent}`);
    const submission = {
      id: id,
      problemId: 1,
      language: 'javascript',
      status: SubmissionStatus.STATUS_PENDING,
      code: fileContent,
    } as any;

    const cwd = path.normalize(path.join('tmp', submission.id.toString()));
    await service.save(cwd, submission);

    const problem = { runtimeLimit: 10000, memoryLimit: 250, methodName } as any;
    const testcases = [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
      { input: '[3, 2, 4], 6', output: '[1, 2]' },
    ] as any[];

    const result = await service.run(cwd, submission, testcases, problem);

    // Add logging to print the actual status
    console.log(`Result: ${result.status}`);
    console.log(`Expected Output: ${SubmissionStatus.STATUS_WRONG_ANSWER}`);

    return result
  };

  // it('should handle runtime error', async () => {
  //   const submission = await getTaskResult('2/Main.js', 'twoSum', 2);
  //   expect(submission.status).toBe(SubmissionStatus.STATUS_RUNTIME_ERROR);
  // });

  it('should handle wrong answer', async () => {
    const submission = await getTaskResult('3/Main.js', 'twoSum', 3);
    expect(submission.status).toBe(SubmissionStatus.STATUS_WRONG_ANSWER);
  });

  // it('should handle time limit exceeded', async () => {
  //   const submission = await getTaskResult('4/Main.js', 'twoSum',4);
  //   expect(submission.status).toBe(SubmissionStatus.STATUS_TIME_LIMIT_EXCEEDED);
  // });

  // it('should handle memory limit exceeded', async () => {
  //   const submission = await getTaskResult('5/Main.js', 'twoSum',5);
  //   expect(submission.status).toBe(SubmissionStatus.STATUS_MEMORY_LIMIT_EXCEEDED);
  // });

  // it('should run the two-sum code successfully', async () => {
  //   const submission = await getTaskResult('1/Main.js', 'twoSum',1);
  //   expect(submission.status).toBe(SubmissionStatus.STATUS_ACCEPTED);
  // });

});