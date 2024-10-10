import {Module} from '@nestjs/common';
import {ReceiverService} from './receiver.service';
import {ReceiverController} from './receiver.controller';
import {Context} from "@modules/receiver/context.service";
import {WorkerModule} from "@modules/worker/worker.module";
import {IndexModule} from "@modules/index/index.module";

@Module({
    imports: [
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
    exports: [
        ReceiverService,
    ],
})
export class ReceiverModule {
}
