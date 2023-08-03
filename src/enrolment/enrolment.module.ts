import { Module } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { EnrolmentController } from './enrolment.controller';

@Module({
  controllers: [EnrolmentController],
  providers: [EnrolmentService]
})
export class EnrolmentModule {}
