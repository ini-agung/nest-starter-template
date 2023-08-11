import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    // return await this.schedulesRepository.find();
    try {
      // const schedulesCounts = await this.schedulesRepository.find();
      const schedulesCounts = await this.schedulesRepository
        .createQueryBuilder('schedules')
        .select('schedules.id', 'id')
        .addSelect('schedule_code', 'schedule_code')
        .addSelect('day_of_week', 'day_of_week')
        .addSelect('time_start', 'time_start')
        .addSelect('time_finish', 'time_finish')
        .addSelect('class.class', 'class')
        .leftJoin('schedules.class_id', 'class')
        .getRawMany();
      return schedulesCounts;
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

  async findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  async remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
