import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/classrooms/entities/classroom.entity';
import { Student } from 'src/students/entities/student.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Pagination, captureSentryException } from '@app/helper';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Student>,
  ) { }
  private readonly logger = new Logger(EnrolmentService.name);

  /**
     * Create a new enrolment.
     *
     * @param createEnrolmentDto - The data to create a new enrolment.
     * @returns The created enrolment data.
     */
  async create(createEnrolmentDto: CreateEnrolmentDto) {
    try {
      const enrolment = this.enrolmentRepository.create(createEnrolmentDto);
      return await this.enrolmentRepository.save(enrolment);
    } catch (error) {
      this.logger.error(`Error saving ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }
  /**
 * Retrieve enrolments for a specific schedule.
 *
 * @param scheduleId - The ID of the schedule to retrieve enrolments for.
 * @returns An array of enrolments associated with the given schedule.
 */
  async fetchEnrolmentsByScheduleId(scheduleId: number): Promise<Enrolment[]> {
    // Use this method to fetch enrolments by schedule_id
    const enrolments = await this.enrolmentRepository
      .createQueryBuilder('enrolment')
      .select(['enrolment.id', 'enrolment.enrol_code', 'enrolment.enrolment_date', 'enrolment.student_id'])
      .leftJoinAndSelect('enrolment.student', 'student')
      .where('enrolment.schedule_id = :scheduleId', { scheduleId })
      .getRawMany();
    return enrolments;
  }

  /**
   * Fetch the schedule information for a given schedule ID.
   *
   * @param schedule_id - The ID of the schedule to fetch.
   * @returns The schedule information for the specified schedule ID.
   */
  async fetchSchedule(schedule_id: number): Promise<any> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .select(['schedule.schedule_code'])
      .where('schedule.id = :schedule_id', { schedule_id })
      .getRawOne();
    return schedule;
  }

  /**
     * Retrieve all enrolments with pagination and additional information.
     *
     * @param page - The current page number (default: 1).
     * @param limit - The number of enrolments per page (default: 10).
     * @returns A paginated list of enrolments with additional information.
     */
  async findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const result: {
        schedule_id: number;
        total_students: number;
        enrolments: Enrolment[];
        schedule: string;
      }[] = [];

      const enrolmentCounts = await this.enrolmentRepository
        .createQueryBuilder('enrolment')
        .select('enrolment.schedule_id', 'schedule_id')
        .addSelect('COUNT(enrolment.id)', 'total_students')
        .groupBy('enrolment.schedule_id')
        .getRawMany();
      for (const item of enrolmentCounts) {
        const { schedule_id } = item;
        const enrolments = await this.fetchEnrolmentsByScheduleId(schedule_id);
        const schedule = await this.fetchSchedule(schedule_id);
        result.push({
          schedule,
          schedule_id,
          total_students: item.total_students,
          enrolments,
        });
      }

      const total = result.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = result.slice(startIdx, endIdx);

      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/enrolments?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/enrolments?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find Enrolments : ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
  * Retrieve filtered enrolments with pagination.
  *
  * @param enrol_code - The enrolment code for filtering.
  * @param schedule - The schedule ID for filtering.
  * @param page - The current page number (default: 1).
  * @param limit - The number of enrolments per page (default: 10).
  * @returns A paginated list of filtered enrolments.
  */
  async findLike(
    enrol_code: string,
    schedule: number,
    page: number,
    limit: number,
  ) {
    try {
      const queryBuilder = await this.enrolmentRepository
        .createQueryBuilder('enrolment')
        .select('enrolment.schedule_id', 'schedule_id')
        .addSelect('enrolment.enrol_code', 'enrol_code')
        .addSelect('enrolment.schedule_id', 'schedule_id')
        .leftJoinAndSelect('enrolment.student', 'student')
        .where('enrolment.enrolment_status = 1')
      if (schedule) {
        queryBuilder.andWhere('enrolment.schedule_id = :schedule', { schedule });
      }
      if (enrol_code) {
        queryBuilder.andWhere('enrolment.enrol_code = :enrol_code', { enrol_code });
      }
      const enrolmentCounts = await queryBuilder.getRawMany();
      const total = enrolmentCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = enrolmentCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/enrolments?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/enrolments?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find parent :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Update an existing enrolment.
   *
   * @param id - The ID of the enrolment to update.
   * @param updateEnrolmentDto - The updated enrolment data.
   * @returns The updated enrolment data.
   */
  async update(id: number, updateEnrolmentDto: UpdateEnrolmentDto) {
    try {
      const parent = await this.enrolmentRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(parent, updateEnrolmentDto);
      return this.enrolmentRepository.save(parent);
    } catch (error) {
      this.logger.error(`Error find parent :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Delete an enrolment (soft delete).
   *
   * @param id - The ID of the enrolment to delete.
   * @returns The deleted enrolment data.
   */
  async remove(id: number) {
    try {
      const parent = await this.enrolmentRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      parent.enrolment_status = false;
      return this.enrolmentRepository.save(parent);
    } catch (error) {
      this.logger.error(`Error find parent :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Restore a soft-deleted enrolment.
   *
   * @param id - The ID of the enrolment to restore.
   * @returns The restored enrolment data.
   */
  async restore(id: number) {
    try {
      const parent = await this.enrolmentRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      parent.enrolment_status = true;
      return this.enrolmentRepository.save(parent);
    } catch (error) {
      this.logger.error(`Error find parent :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
