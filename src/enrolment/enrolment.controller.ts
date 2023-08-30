import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { responseJson } from '@app/response';

@Controller('enrolment')
export class EnrolmentController {
  constructor(private readonly enrolmentService: EnrolmentService) { }
  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  /**
       * Create a new enrolment.
       *
       * @param createEnrolmentDto - Data to create a new enrolment.
       * @param response - HTTP response object.
       */
  @Post()
  async create(@Body() createEnrolmentDto: CreateEnrolmentDto,
    @Res() response,
  ) {
    const enrolment = await this.enrolmentService.create(createEnrolmentDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New enrolment',
      data: {}
    };
    data.data = enrolment;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Retrieve all enrolments with optional filtering and pagination.
     *
     * @param page - Page number for pagination (default: 1).
     * @param limit - Number of items per page (default: 10).
     * @param enrol_code - Enrole code
     * @param schedule - Schedule id
     * @param response - HTTP response object.
     */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('enrol_code') enrol_code: string,
    @Query('schedule') schedule: number,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Enrolments',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const enrolements = await this.enrolmentService.findLike(enrol_code, schedule, page, limit);
    data.data = enrolements;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Update an existing enrolment.
     *
     * @param id - ID of the enrolment to update.
     * @param updateEnrolmentDto - Updated enrolment data.
     * @param response - HTTP response object.
     */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEnrolmentDto: UpdateEnrolmentDto,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Enrolment',
      data: {}
    };
    const enrolment = await this.enrolmentService.update(+id, updateEnrolmentDto);
    data.data = enrolment;
    responseJson(data, data.statusCode, response);
  }

  /**
  * Delete a enrolment (soft delete).
  *
  * @param id - ID of the enrolment to delete.
  * @param response - HTTP response object.
  */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Enrolment',
      data: {}
    };
    const enrolment = await this.enrolmentService.remove(+id);
    data.data = enrolment;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Restore a previously soft-deleted enrolment.
   *
   * @param id - ID of the enrolment to restore.
   * @param response - HTTP response object.
   */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredEnrolment = await this.enrolmentService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Success Restore Enrolment',
      data: {}
    };
    data.data = restoredEnrolment;
    responseJson(data, data.statusCode, response);
  }
}
