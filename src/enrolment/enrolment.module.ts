import { Module } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { EnrolmentController } from './enrolment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Class } from 'src/class/entities/class.entity';
import { Student } from 'src/students/entities/student.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, Class, Student, Schedule])],
  controllers: [EnrolmentController],
  providers: [EnrolmentService]
})
export class EnrolmentModule { }
