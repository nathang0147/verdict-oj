import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@modules/user/dto/create.user.dto";
import {FindDto} from "../../api/utils/find.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
    findAll(@Query() findDto: FindDto) {
        return this.userService.findAll(findDto)
    }
}
