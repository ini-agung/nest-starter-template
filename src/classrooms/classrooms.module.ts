import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { Class } from './entities/classroom.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService]
})
export class ClassroomsModule { }
