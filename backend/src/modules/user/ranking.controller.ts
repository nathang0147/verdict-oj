import {Controller, Get, Req} from "@nestjs/common";
import {UserService} from "@modules/user/user.service";
import {SubmissionService} from "@modules/submission/submission.service";
import {calculatePagination} from "../../common/common.function";
import {ConfigService} from "@nestjs/config";
import {EnvironmentVariables} from "@configs/env/configuration.config";

@Controller('ranking')
export class RankingController {
    private paginationPerPage: number;
    constructor(
        private readonly userService: UserService,
        private readonly submissionService: SubmissionService,
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {
        this.paginationPerPage = this.configService.get('paginationPerPage');
    }

    @Get()
    async index(@Req() req: any){
        const user = req.user;
        const submission = await this.submissionService.getCount({userId: user.id});
        const pagination = calculatePagination(submission,1, this.paginationPerPage)

        return await this.userService.getUserRanking(pagination.offset, pagination.pageSize);

    }
}