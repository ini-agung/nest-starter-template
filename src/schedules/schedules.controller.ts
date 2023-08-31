import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { responseJson } from '@app/response';

/**
 * Controller responsible for managing schedules.
 */
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }
  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  /**
   * Create a new schedule.
   *
   * @param createScheduleDto - Data to create a new schedule.
   * @param response - HTTP response object.
   */
  @Post()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Teacher',
      data: {}
    };
    const teacher = await this.schedulesService.create(createScheduleDto);
    data.data = teacher;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve schedules based on optional query parameters.
   *
   * @param day - Filter by day of the week.
   * @param time_start - Filter by start time.
   * @param time_finish - Filter by finish time.
   * @param clas - Filter by class.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('day') day: string,
    @Query('start_time') time_start: string,
    @Query('finish_time') time_finish: string,
    @Query('class') clas: string,
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Schedules',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const schedules = await this.schedulesService.findLike(day, time_start, time_finish, clas, page, limit);
    data.data = schedules;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Update an existing schedule.
   *
   * @param id - ID of the schedule to update.
   * @param updateScheduleDto - Updated schedule data.
   * @param response - HTTP response object.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Schedule',
      data: {}
    };
    const schedule = await this.schedulesService.update(+id, updateScheduleDto);
    data.data = schedule;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Delete a schedule.
   *
   * @param id - ID of the schedule to delete.
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
      message: 'Success Delete Schedule',
      data: {}
    };
    const schedule = await this.schedulesService.remove(+id);
    data.data = schedule;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Restore a deleted schedule.
   *
   * @param id - ID of the schedule to restore.
   * @param response - HTTP response object.
   */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredSchedule = await this.schedulesService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Schedule',
      data: {}
    };
    if (restoredSchedule == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Schedule with id ${id} not found`;
    } else {
      data.data = restoredSchedule;
    }
    responseJson(data, data.statusCode, response);
  }
}
