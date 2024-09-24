import {Controller, Get, Req} from "@nestjs/common";
import {UserService} from "@modules/user/user.service";
import {SubmissionService} from "@modules/submission/submission.service";

@Controller('ranking')
export class RankingController {
    constructor(
        private readonly userService: UserService,
        private readonly submissionService: SubmissionService
    ) {
    }

    @Get()
    async index(@Req() req: any){
        const user = req.user;
        const submission = await this.submissionService.getCount({userId: user.id});
        const pagination = await this.submissionService.getSubmissionPagination(1,);

        const ranking = this.userService.getUserRanking();

    }
}