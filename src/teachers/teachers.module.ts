import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Degree } from './entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Degree])],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule { }
