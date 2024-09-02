import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRoles } from '@modules/user-roles/entities/user-roles.entities';
import { CreateUserRolesDto } from '@modules/user-roles/dto/create.user-roles.dto';
import { UpdateUserRoleDto } from '@modules/user-roles/dto/update.user-role.dto';

@Controller('user-roles')
@UseInterceptors(ClassSerializerInterceptor)
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  create(@Body() createUserRolesDto: CreateUserRolesDto): Promise<UserRoles> {
    return this.userRolesService.create(createUserRolesDto);
  }

  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<UserRoles> {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  update(
      @Param('id') id: number,
      @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRoles> {
    return this.userRolesService.update(id, updateUserRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.userRolesService.remove(id);
  }
}