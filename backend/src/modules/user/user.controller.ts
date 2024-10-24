import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get, Param, Patch,
  Post,
  Query, Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindDto} from "../../api/utils/find.dto";
import {User} from "@modules/user/entities/user.entity";
import {FindOptionsWhere} from "typeorm";
import {Roles, ROLES_KEY} from "../../decorators/roles.decorator";
import Role from "@modules/authorization/contrants/role.enum";
import {RoleGuard} from "@modules/authorization/guard/role.guard";
import {UpdateUserDto} from "@modules/user/dto/update.user.dto";
import {ProblemService} from "@modules/problem/problem.service";
import {SubmissionService} from "@modules/submission/submission.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user/')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly problemService: ProblemService,
        private readonly submissionService: SubmissionService
    ) {
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Get()
    @Roles(Role.USER)
    findAll() {
        return this.userService.findAll()
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id)
    }

    @Get('ranking')
    getUserRanking(@Body() offset: number, @Body() limit: number) {
        return this.userService.getUserRanking(offset, limit);
    }

    @Get('solved-problems')
    getSolvedProblemsCount(@Req() req: any) {
      const userId = req.user.id;
        return this.userService.getSolvedProblemsCount(userId);
    }

    @Get('problem-solved-status')
    getProblemSolvedStatus(@Req() req: any) {
      return this.userService.getProblemSolvedStatus(req.user.id);
    }

    @Roles(Role.ADMIN)
    @Get('admin')
    index(){
        return {
            problem_count: this.problemService.getTotalProblemsCount(),
            users_count: this.userService.getTotalUsersCount(),
            submissions_count: this.submissionService.getTotalSubmissionsCount()
        }
    }
}
