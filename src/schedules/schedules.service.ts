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

  /**
     * Create a new schedule.
     *
     * @param createScheduleDto - Data to create a new schedule.
     * @returns The created schedule.
     * @throws ConflictException if there's an error while creating the schedule.
     */
  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const schedule = await this.schedulesRepository.create(createScheduleDto);
      return await this.schedulesRepository.save(schedule);
    } catch (error) {
      this.logger.error(`Error saving ${error.message}`);
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

  /**
   * Retrieve all schedules with pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns A paginated list of schedules.
   * @throws ConflictException if there's an error while retrieving schedules.
   */
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
      this.logger.error(`Error find schedules : ${error.message}`);
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

  /**
     * Retrieve schedules based on query parameters with pagination.
     *
     * @param day - Filter by day of the week.
     * @param time_start - Filter by start time.
     * @param time_finish - Filter by finish time.
     * @param clas - Filter by class.
     * @param page - Page number for pagination (default: 1).
     * @param limit - Number of items per page (default: 10).
     * @returns A paginated list of schedules that match the query criteria.
     * @throws ConflictException if there's an error while retrieving schedules.
     */
  async findLike(
    day: string,
    time_start: string,
    time_finish: string,
    clas: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<any>> {
    const queryBuilder = this.schedulesRepository.createQueryBuilder('schedules')
      .select(['schedules.id', 'schedules.schedule_code', 'schedules.day_of_week', 'schedules.time_start', 'schedules.time_finish'])
      .addSelect('class.class', 'class')
      .addSelect('class.id', 'class_id')
      .addSelect('class.max_students', 'max_students')
      .addSelect('class.teacher_id', 'teacher_id')
      .leftJoin('schedules.class_id', 'class')
      .where('schedules.deletedAt IS NULL')
    if (day) {
      queryBuilder.andWhere('schedules.day_of_week = :day', { day });
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

  /**
   * Update an existing schedule.
   *
   * @param id - ID of the schedule to update.
   * @param updateScheduleDto - Updated schedule data.
   * @returns The updated schedule.
   * @throws ConflictException if the schedule doesn't exist or there's an error during update.
   */
  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      const schedule = await this.schedulesRepository.findOneBy({ id });
      if (!schedule) {
        const data = {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Schedule with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(schedule, updateScheduleDto);
      return this.schedulesRepository.save(schedule);
    } catch (error) {
      this.logger.error(`Error find schedule :  ${error.message}`);
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

  /**
   * Soft-delete a schedule.
   *
   * @param id - ID of the schedule to delete.
   * @returns The soft-deleted schedule.
   * @throws ConflictException if the schedule doesn't exist or there's an error during deletion.
   */
  async remove(id: number) {
    try {
      const schedule = await this.schedulesRepository.findOneBy({ id });
      if (!schedule) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `schedule with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      schedule.deletedAt = new Date();
      return this.schedulesRepository.save(schedule);
    } catch (error) {
      this.logger.error(`Error find schedule :   ${error.message}`);
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

  /**
   * Restore a previously soft-deleted schedule.
   *
   * @param id - ID of the schedule to restore.
   * @returns The restored schedule or null if not found.
   * @throws ConflictException if there's an error during restoration.
   */
  async restore(id: number): Promise<Schedule> {
    try {
      const scheduleToRestore = await this.schedulesRepository
        .createQueryBuilder('schedule')
        .withDeleted() // Include soft-deleted entities
        .where('schedule.id = :id', { id })
        .getOne();
      if (scheduleToRestore) {
        scheduleToRestore.deletedAt = null; // Set deletedAt back to null
        return await this.schedulesRepository.save(scheduleToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find teacher :   ${error.message}`);
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
}
