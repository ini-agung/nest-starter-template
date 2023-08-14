import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/classrooms/entities/classroom.entity';
import { Student } from 'src/students/entities/student.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Pagination } from '@app/helper';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Student>,


  ) { }
  private readonly logger = new Logger(EnrolmentService.name);

  async create(createEnrolmentDto: CreateEnrolmentDto) {
    try {
      const parent = this.enrolmentRepository.create(createEnrolmentDto);
      return await this.enrolmentRepository.save(parent);
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

  async fetchSchedule(schedule_id: number): Promise<any> {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .select(['schedule.schedule_code'])
      .where('schedule.id = :schedule_id', { schedule_id })
      .getRawOne();
    return schedule;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Pagination<any>> {
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
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} enrolment`;
  }

  update(id: number, updateEnrolmentDto: UpdateEnrolmentDto) {
    return `This action updates a #${id} enrolment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrolment`;
  }
}
