import {Res, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseJson } from '@app/response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() response) {
    const data = {
      "adas":123
  }
    responseJson(data, 200, response);
    // return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Res() response) {
    const data = {
      "adas":123
  }
    responseJson(data, 200, response);
    // return this.usersService.create(createUserDto);
    // return this.usersService.findAll();
  }

  @Get(':identity')
  findOne(@Param('identity') identity: string) {
    return this.usersService.findOne(identity);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
