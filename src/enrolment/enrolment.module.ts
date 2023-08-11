import { Module } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { EnrolmentController } from './enrolment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Class } from 'src/classrooms/entities/classroom.entity';
import { Student } from 'src/students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, Class, Student])],
  controllers: [EnrolmentController],
  providers: [EnrolmentService]
})
export class EnrolmentModule { }
