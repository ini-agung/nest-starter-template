import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { responseJson } from '@app/response';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  /**
   * Create a new teacher.
   *
   * @param createTeacherDto - Data to create a new teacher.
   * @param response - HTTP response object.
   */
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

  /**
   * Retrieve all teachers with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param nik - Filter by teacher's National Identification Number (NIK).
   * @param full_name - Filter by teacher's full name.
   * @param nick_name - Filter by teacher's nickname.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('nik') nik: number,
    @Query('name') name: string,
    @Res() response) {
    console.log(limit)
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Teachers',
      data: {}
    };
    page = (page < 1) ? this._page : page;
    limit = (limit > this._limit) ? this._limit : limit;
    console.log(this._limit)
    let teachers;
    if (nik || name) {
      teachers = await this.teachersService.findLike(nik, name);
    } else {
      teachers = await this.teachersService.findAll(page, limit);
    }
    data.data = teachers;
    responseJson(data, data.statusCode, response);
  }


  /**
  * Update an existing teacher.
  *
  * @param id - ID of the teacher to update.
  * @param updateTeacherDto - Updated teacher data.
  * @param response - HTTP response object.
  */
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

  /**
   * Soft-delete a teacher.
   *
   * @param id - ID of the teacher to delete.
   * @param response - HTTP response object.
   */
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

  /**
   * Restore a previously soft-deleted teacher.
   *
   * @param id - ID of the teacher to restore.
   * @param response - HTTP response object.
   */
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
