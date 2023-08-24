import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { responseJson } from '@app/response';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  /**
     * Create a new student.
     *
     * @param createStudentDto - Data to create a new student.
     * @param response - HTTP response object.
     */
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() response,
  ) {
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

  /**
   * Retrieve all students with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param nis - Filter by student's National Identity Number (NIS).
   * @param name - Filter by student's name.
   * @param nick_name - Filter by student's nickname.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('nis') nis: number,
    @Query('name') name: string,
    @Query('nick_name') nick_name: string,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Students',
      data: {}
    };
    page = (page < 1) ? 1 : page;
    limit = (limit > 10) ? 10 : limit;
    let students: object;
    if (nis || name || nick_name) {
      students = await this.studentsService.findLike(nis, name, nick_name, page, limit);
    } else {
      students = await this.studentsService.findAll(page, limit);
    }
    data.data = students;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve a single student by ID.
   *
   * @param id - ID of the student to retrieve.
   * @param response - HTTP response object.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() response,
  ) {
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

  /**
     * Update an existing student.
     *
     * @param id - ID of the student to update.
     * @param updateStudentDto - Updated student data.
     * @param response - HTTP response object.
     */
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @Res() response,
  ) {
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

  /**
   * Delete a student (soft delete).
   *
   * @param id - ID of the student to delete.
   * @param response - HTTP response object.
   */
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Res() response,
  ) {
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

  /**
   * Restore a previously soft-deleted student.
   *
   * @param id - ID of the student to restore.
   * @param response - HTTP response object.
   */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredUser = await this.studentsService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Success Restore Student',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
