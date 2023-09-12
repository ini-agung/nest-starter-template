import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { responseJson } from '@app/response';
import { Response, Request } from 'express';

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
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   * @returns Created classroom data.
   */
  @Post()
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
    @Req() request: Request,
    @Res() response: Response,
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
   * Retrieve all lassrooms with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param id - Filter by lassroom's id.
   * @param classroom - Filter by lassroom's classroom.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('id') id: number,
    @Query('classroom') classroom: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get classrooms',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const classrooms = await this.classroomsService.findLike(id, classroom, page, limit);
    data.data = classrooms;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Update a classroom's details.
     *
     * @param id - ID of the classroom to update.
     * @param updateClassroomDto - Data to update the classroom.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     * @returns Updated classroom data.
     */
  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
    @Req() request: Request,
    @Res() response: Response,
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
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     * @returns Deleted classroom data.
     */
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
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
    * @param request - HTTP request object.
    * @param response - HTTP response object. 
    */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const restoredUser = await this.classroomsService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Classroom',
      data: {}
    };
    if (restoredUser == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Classroom with id ${id} not found`;
    } else {
      data.data = restoredUser;
    }
    responseJson(data, data.statusCode, response);
  }
}
