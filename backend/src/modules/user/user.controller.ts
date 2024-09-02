import {Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindDto} from "../../api/utils/find.dto";
import {User} from "@modules/user/entities/user.entity";
import {FindOptionsWhere} from "typeorm";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }
  
}
