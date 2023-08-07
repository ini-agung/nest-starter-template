import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './entities/teachers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teachers])],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule { }
