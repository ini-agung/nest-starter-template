import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { responseJson } from '@app/response';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  @Post()
  async create(@Body() createClassroomDto: CreateClassroomDto,
    @Res() response,
  ) {
    this.classroomsService.create(createClassroomDto);
    const classroom = await this.classroomsService.create(createClassroomDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Classroom',
      data: {}
    };
    data.data = classroom;
    responseJson(data, data.statusCode, response);
  }

  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('id') id: number,
    @Query('classroom') classroom: string,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get classrooms',
      data: {}
    };
    page = (page < 1) ? this._page : page;
    limit = (limit > this._page) ? this._limit : limit;
    let classrooms: object;
    if (id || classroom) {
      classrooms = await this.classroomsService.findLike(id, classroom, page, limit);
    } else {
      classrooms = await this.classroomsService.findAll(page, limit);
    }
    data.data = classrooms;
    responseJson(data, data.statusCode, response);
    return await this.classroomsService.findAll();
  }


  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Classroom',
      data: {}
    };
    const parent = await this.classroomsService.update(+id, updateClassroomDto);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete classroom',
      data: {}
    };
    const classroom = await this.classroomsService.remove(+id);
    data.data = classroom;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredUser = await this.classroomsService.restore(id);
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
