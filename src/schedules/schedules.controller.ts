import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { responseJson } from '@app/response';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  async findAll(
    @Query('day') day: string,
    @Query('start_time') time_start: string,
    @Query('finish_time') time_finish: string,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Schedules',
      data: {}
    };
    let schedules = [];
    if (day || time_start || time_finish) {
      schedules = await this.schedulesService.findOne(day, time_start, time_finish);
    } else {
      schedules = await this.schedulesService.findAll();
    }
    data.data = schedules;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(
    @Query('day') day: string,
    @Query('start_time') startTime: string,
    @Query('finish_time') finishTime: string,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Schedules',
      data: {}
    };
    const schedules = await this.schedulesService.findOne(day, startTime, finishTime);
    data.data = schedules;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
