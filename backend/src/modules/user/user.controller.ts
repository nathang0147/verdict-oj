import {Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindDto} from "../../api/utils/find.dto";
import {User} from "@modules/user/entities/user.entity";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  findAll(@Query() findDto: FindDto<User>) {
      return this.userService.findAll(findDto)
  }
  
}
