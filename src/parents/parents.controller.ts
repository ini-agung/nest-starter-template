import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { responseJson } from '@app/response';
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }

  @Post()
  async create(@Body() createParentDto: CreateParentsDto, @Res() response) {
    const parent = await this.parentsService.create(createParentDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Parent',
      data: {}
    };
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Get()
  async findAll(@Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parents',
      data: {}
    };
    const parents = await this.parentsService.findAll();
    data.data = parents;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parent',
      data: {}
    };
    const parent = await this.parentsService.findOne(+id);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateParentDto: UpdateParentsDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Parent',
      data: {}
    };
    const parent = await this.parentsService.update(+id, updateParentDto);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Parent',
      data: {}
    };
    const parent = await this.parentsService.remove(+id);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }
}
