import {Module} from '@nestjs/common';
import {ReceiverService} from './receiver.service';
import {ReceiverController} from './receiver.controller';
import {QueueModule} from "@modules/queue/queue.module";
import {ProblemRepository, SubmissionRepository, TestcaseRepository} from "@repositories/index.repository";
import {Context} from "@modules/receiver/context.service";
import {JSWorkerService} from "@modules/worker/worker.service";
import {WorkerModule} from "@modules/worker/worker.module";
import {IndexModule} from "@modules/index/index.module";

@Module({
    imports: [
        QueueModule,
        WorkerModule,
        IndexModule
    ],
    controllers: [
        ReceiverController,
    ],
    providers: [
        ReceiverService,
        Context,
    ],
})
export class ReceiverModule {
}
