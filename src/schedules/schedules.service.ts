import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { Pagination } from '@app/helper';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,

  ) { }
  private readonly logger = new Logger(SchedulesService.name);

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Pagination<any>> {
    // return await this.schedulesRepository.find();
    try {
      // const schedulesCounts = await this.schedulesRepository.find();
      const schedulesCounts = await this.schedulesRepository
        .createQueryBuilder('schedules')
        .select('schedules.id', 'schedule_id')
        .addSelect('schedule_code', 'schedule_code')
        .addSelect('day_of_week', 'day_of_week')
        .addSelect('time_start', 'time_start')
        .addSelect('time_finish', 'time_finish')
        .addSelect('class.class', 'class')
        .addSelect('class.id', 'class_id')
        .addSelect('class.max_students', 'max_students')
        .addSelect('class.teacher_id', 'teacher_id')
        .addSelect('teacher.nik', 'nik')
        .addSelect('teacher.full_name', 'full_name')
        .leftJoin('schedules.class_id', 'class')
        .leftJoin('class.classroom', 'classroom')
        .leftJoin('class.teacher', 'teacher')
        .orderBy('schedules.id', 'ASC')
        .getRawMany();
      const total = schedulesCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = schedulesCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/schedules?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/schedules?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find parents : ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  async findLike(
    day: string,
    time_start: string,
    time_finish: string,
    clas: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<any>> {
    this.logger.log([day, time_start, time_finish]);
    const queryBuilder = this.schedulesRepository.createQueryBuilder('schedules')
      .select(['schedules.id', 'schedules.schedule_code', 'schedules.day_of_week', 'schedules.time_start', 'schedules.time_finish'])
      .addSelect('class.class', 'class')
      .addSelect('class.id', 'class_id')
      .addSelect('class.max_students', 'max_students')
      .addSelect('class.teacher_id', 'teacher_id')
      .leftJoin('schedules.class_id', 'class')

    if (day) {
      queryBuilder.where('schedules.day_of_week = :day', { day });
    }
    if (time_start) {
      queryBuilder.andWhere('schedules.time_start = :time_start', { time_start });
    }
    if (time_finish) {
      queryBuilder.andWhere('schedules.time_finish = :time_finish', { time_finish });
    }

    if (clas) {
      queryBuilder.andWhere('(schedules.schedule_code LIKE :clas OR class.class LIKE :clas)', { clas: `%${clas}%` });
    }
    const schedulesCounts = await queryBuilder.getRawMany();
    const total = schedulesCounts.length;
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const data = schedulesCounts.slice(startIdx, endIdx);
    return {
      data,
      total,
      currentPage: page,
      perPage: limit,
      prevPage: page > 1 ? `/schedules?page=${(parseInt(page.toString()) - 1)}` : undefined,
      nextPage: endIdx < total ? `/schedules?page=${(parseInt(page.toString()) + 1)}` : undefined,
    };
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  async remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
