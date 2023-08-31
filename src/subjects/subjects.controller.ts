import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { responseJson } from '@app/response';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  private _version = (process.env.VERSION.toLowerCase() == 'v2') ? true : false;

  /**
   * Create a new subject.
   *
   * @param createSubjectDto - Data to create a new subject.
   * @returns Created subject data.
   */
  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto,
    @Res() response,
  ) {
    this.subjectService.create(createSubjectDto);
    const subject = await this.subjectService.create(createSubjectDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New subject',
      data: {}
    };
    data.data = subject;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Get a list of all subjects.
   *
   * @returns List of subjects.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('id') id: number,
    @Query('subject') subject: string,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Subjects',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const subjects = await this.subjectService.findLike(id, subject, page, limit);
    data.data = subjects;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Update a subject's details.
     *
     * @param id - ID of the subject to update.
     * @param updateSubjectDto - Data to update the subject.
     * @returns Updated subject data.
     */
  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update subject',
      data: {}
    };
    const parent = await this.subjectService.update(+id, updateSubjectDto);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Delete a subject.
     *
     * @param id - ID of the subject to delete.
     * @returns Deleted subject data.
     */
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Subject',
      data: {}
    };
    const subject = await this.subjectService.remove(+id);
    data.data = subject;
    responseJson(data, data.statusCode, response);
  }

  /**
    * Restore a previously soft-deleted subject.
    *
    * @param id - ID of the subject to restore.
    * @param response - HTTP response object.
    */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredSubject = await this.subjectService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Subject',
      data: {}
    };
    if (restoredSubject == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Subject with id ${id} not found`;
    } else {
      data.data = restoredSubject;
    }
    responseJson(data, data.statusCode, response);
  }
}
