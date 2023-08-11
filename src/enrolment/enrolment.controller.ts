import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { responseJson } from '@app/response';

@Controller('enrolment')
export class EnrolmentController {
  constructor(private readonly enrolmentService: EnrolmentService) { }

  @Post()
  async create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return await this.enrolmentService.create(createEnrolmentDto);
  }

  @Get()
  async findAll(@Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parents',
      data: {}
    };
    const parents = await this.enrolmentService.findAll();
    data.data = parents;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.enrolmentService.findOne(+id);
  }

  @Patch(':id')
  asyncupdate(@Param('id') id: string, @Body() updateEnrolmentDto: UpdateEnrolmentDto) {
    return this.enrolmentService.update(+id, updateEnrolmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.enrolmentService.remove(+id);
  }
}
