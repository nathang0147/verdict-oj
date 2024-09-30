import {Module} from '@nestjs/common';
import {ReceiverService} from './receiver.service';
import {ReceiverController} from './receiver.controller';
import {QueueModule} from "@modules/queue/queue.module";
import {ProblemRepository, SubmissionRepository, TestcaseRepository} from "@repositories/index.repository";
import {Context} from "@modules/receiver/context.service";
import {JSWorkerService} from "@modules/worker/worker.service";

@Module({
    imports: [
        QueueModule,
        JSWorkerService
    ],
    controllers: [
        ReceiverController,
    ],
    providers: [
        ReceiverService,
        Context,
        ProblemRepository,
        TestcaseRepository,
        SubmissionRepository
    ],
})
export class ReceiverModule {
}
