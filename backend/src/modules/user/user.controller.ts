import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get, Param, Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindDto} from "../../api/utils/find.dto";
import {User} from "@modules/user/entities/user.entity";
import {FindOptionsWhere} from "typeorm";
import {Roles, ROLES_KEY} from "../../decorators/roles.decorator";
import Role from "@modules/authorization/contrants/role.enum";
import {RoleGuard} from "@modules/authorization/guard/role.guard";
import {UpdateUserDto} from "@modules/user/dto/update.user.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @Roles(Role.USER)
  findAll(){
    return this.userService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
    return this.userService.update(id, updateUserDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
