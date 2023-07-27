import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    return await this.studentsService.findAll();
  }

  @Get(':identity')
  async findOne(@Param('identity') identity: any) {
    return await this.studentsService.findOne(+identity);
  }

  @Patch(':identity')
  async update(@Param('identity') identity: string, @Body() updateStudentDto: UpdateStudentDto) {
    return await this.studentsService.update(+identity, updateStudentDto);
  }

  @Delete(':identity')
  async remove(@Param('identity') identity: string) {
    return await this.studentsService.remove(+identity);
  }
}
