import {Module} from '@nestjs/common';
import {ProblemTagService} from './problem-tag.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProblemTag} from "@modules/problem-tag/entities/problem-tag.entity";
import {Tag} from "@modules/problem-tag/entities/tag.entity";
import {ProblemTagRepository} from "@repositories/problem-tag.repository";
import {TagService} from "@modules/problem-tag/tag.service";
import {TagRepository} from "@repositories/tag.repository";
import {Problem} from "@modules/problem/entities/problem.entity";
import {AdminTagController} from "@modules/problem-tag/admin.tag.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProblemTag, Tag, Problem])
    ],
    controllers: [AdminTagController],
    providers: [
        ProblemTagService,
        TagService,
        {
            provide: 'ProblemTagRepositoryInterface',
            useClass: ProblemTagRepository
        },
        {
            provide: 'TagRepositoryInterface',
            useClass: TagRepository
        }
    ],
    exports: [
        ProblemTagService,
        TagService,
        TypeOrmModule.forFeature([ProblemTag, Tag])]
})
export class ProblemTagModule {
}
