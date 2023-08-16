import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { responseJson } from '@app/response';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto, @Res() response) {
    const student = await this.studentsService.create(createStudentDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Student',
      data: {}
    };
    data.data = student;
    responseJson(data, data.statusCode, response);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Students',
      data: {}
    };
    page = (page < 1) ? 1 : page;
    limit = (limit > 10) ? 10 : limit;
    const students = await this.studentsService.findAll(page, limit);
    data.data = students;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Students',
      data: {}
    };
    const students = await this.studentsService.findOne(+id);
    data.data = students;
    responseJson(data, data.statusCode, response);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Student',
      data: {}
    };
    const parent = await this.studentsService.update(+id, updateStudentDto);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Student',
      data: {}
    };
    const student = await this.studentsService.remove(+id);
    data.data = student;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: number, @Res() response) {
    const restoredUser = await this.studentsService.restore(id);
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
