import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { DBRead } from '@app/connections';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    const properties = [
      'nis', 
      'full_name',
      'nick_name',
      'email',
      'password',
      'child_order',
      'date_birth',
      'place_birth',
      'gender',
      'phone',
      'entry_year',
      'img',
      'religion',
      'siblings',
      'address'];
    const parameter = 'WHERE deletedAt IS NULL';
    return DBRead('students', properties, parameter, 'nis ASC');
    // return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
