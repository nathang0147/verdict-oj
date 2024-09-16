import {Module} from "@nestjs/common";
import {RedisService} from "@modules/cache/redis.service";

@Module({
    imports: [],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule{}