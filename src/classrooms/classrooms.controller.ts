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
  private _version = (process.env.VERSION.toLowerCase() == 'v2') ? true : false;

  /**
   * Create a new classroom.
   *
   * @param createClassroomDto - Data to create a new classroom.
   * @returns Created classroom data.
   */
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

  /**
   * Get a list of all classrooms.
   *
   * @returns List of classrooms.
   */
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
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
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

  /**
     * Update a classroom's details.
     *
     * @param id - ID of the classroom to update.
     * @param updateClassroomDto - Data to update the classroom.
     * @returns Updated classroom data.
     */
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

  /**
     * Delete a classroom.
     *
     * @param id - ID of the classroom to delete.
     * @returns Deleted classroom data.
     */
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

  /**
    * Restore a previously soft-deleted classroom.
    *
    * @param id - ID of the classroom to restore.
    * @param response - HTTP response object.
    */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredUser = await this.classroomsService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Classroom',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
