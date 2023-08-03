import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';

@Controller('enrolment')
export class EnrolmentController {
  constructor(private readonly enrolmentService: EnrolmentService) {}

  @Post()
  create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentService.create(createEnrolmentDto);
  }

  @Get()
  findAll() {
    return this.enrolmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrolmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrolmentDto: UpdateEnrolmentDto) {
    return this.enrolmentService.update(+id, updateEnrolmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrolmentService.remove(+id);
  }
}
