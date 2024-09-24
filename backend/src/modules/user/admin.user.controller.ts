import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post} from "@nestjs/common";
import {UserService} from "@modules/user/user.service";
import {ProblemService} from "@modules/problem/problem.service";
import {SubmissionService} from "@modules/submission/submission.service";
import {SearchUserDto} from "@modules/user/dto/search.user.dto";
import {Roles} from "../../decorators/roles.decorator";
import Role from "@modules/authorization/contrants/role.enum";
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {UpdateUserDto} from "@modules/user/dto/update.user.dto";

@Roles(Role.ADMIN)
@Controller('admin/user')
export class AdminUserController {
    constructor(
        private readonly userService: UserService,
        private readonly problemService: ProblemService,
        private readonly submissionService: SubmissionService
    ) {}

    @Get('search')
    searchUser(@Body() searchUserDto: SearchUserDto) {
        return this.userService.searchUser(searchUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Post('add')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Patch('update')
    update(@Body() updateUserDto: UpdateUserDto) {
        const user = this.userService.getUserByEmail(updateUserDto.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            return this.userService.update(updateUserDto.id, updateUserDto)
        }catch (e){
            throw e
        }
    }
}