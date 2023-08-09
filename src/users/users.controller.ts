import { Res, Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseJson } from '@app/response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response) {
    const newUser = await this.usersService.create(createUserDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Users',
      data: {}
    };
    data.data = newUser;
    responseJson(data, data.statusCode, response);
  }


  @Get()
  async findAll(@Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users',
      data: {}
    };
    const users = await this.usersService.findAll();
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  @Get(':identity')
  async findOne(@Param('identity') identity: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users',
      data: {}
    };
    const users = await this.usersService.findOne(identity);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Users',
      data: {}
    };
    const users = await this.usersService.update(+id, updateUserDto);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Users',
      data: {}
    };
    const users = await this.usersService.remove(+id);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }
}
