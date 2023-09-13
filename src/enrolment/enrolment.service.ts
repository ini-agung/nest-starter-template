import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/class/entities/class.entity';
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
      .cache(true)
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
      .cache(true)
      .getRawOne();
    return schedule;
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
    schedule_id: number,
    student_id: number,
    page: number,
    limit: number,
  ) {
    //: Promise<Pagination<any>>
    try {
      const queryBuilder = await this.enrolmentRepository
        .createQueryBuilder('e')
        .select([
          'e.id', 'e.enrol_code',
          's.nis', 's.full_name',
          'g.gender',
          'ss.id', 'ss.schedule_code', 'ss.day_of_week', 'ss.time_start', 'ss.time_finish',
          'c.class'
        ])
        .leftJoin('e.student', 's')
        .leftJoin('s.gender', 'g')
        .leftJoin('e.schedule', 'ss')
        .leftJoin('ss.class_id', 'c')
        .where('e.enrolment_status = 1')
        .cache(true)
      if (student_id) {
        queryBuilder.andWhere('e.student_id = :student_id', { student_id: student_id })
      }
      if (schedule_id) {
        queryBuilder.andWhere('e.schedule_id = :schedule_id', { schedule_id: schedule_id })
      }

      const enrolmentCounts = await queryBuilder.orderBy('e.id').getMany();
      const total = enrolmentCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = enrolmentCounts.slice(startIdx, endIdx);
      let prevPage;
      if (page <= 1) {
        prevPage = undefined;
      } else {
        prevPage = `/enrolment?page=${(parseInt(page.toString()) - 1)}`;
        if (limit > 0) {
          prevPage += `&limit=${limit}`;
        }
        if (student_id > 0) {
          prevPage += `&student=${student_id}`;
        }
      }

      let nextPage;
      if (endIdx >= total) {
        nextPage = undefined;
      } else {
        nextPage = `/enrolment?page=${(parseInt(page.toString()) + 1)}`;
        if (limit > 0) {
          nextPage += `&limit=${limit}`;
        }
        if (student_id > 0) {
          nextPage += `&student=${student_id}`;
        }
      }
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: prevPage,
        nextPage: nextPage,
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
