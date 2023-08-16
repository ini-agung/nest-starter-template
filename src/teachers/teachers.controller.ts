import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { responseJson } from '@app/response';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Teacher',
      data: {}
    };
    const teacher = await this.teachersService.create(createTeacherDto);
    data.data = teacher;
    responseJson(data, data.statusCode, response);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('nik') nik: number,
    @Query('full_name') full_name: string,
    @Query('nick_name') nick_name: string,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Teachers',
      data: {}
    };
    page = (page < 1) ? 1 : page;
    limit = (limit > 10) ? 10 : limit;
    let teachers;
    if (nik || full_name || nick_name) {
      teachers = await this.teachersService.findLike(nik, full_name, nick_name);
    } else {
      teachers = await this.teachersService.findAll(page, limit);
    }
    data.data = teachers;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Teachers',
      data: {}
    };
    // const teacher = await this.teachersService.findOne(+id);
    // data.data = teacher;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Update Teacher',
      data: {}
    };
    const teacher = await this.teachersService.update(+id, updateTeacherDto);
    data.data = teacher;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Success Delete Teacher',
      data: {}
    };
    const teacher = await this.teachersService.remove(+id);
    data.data = teacher;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: number, @Res() response) {
    const restoredUser = await this.teachersService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Success Restore Teacher',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
