import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { Parents } from './entities/parents.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Parents])],
  controllers: [ParentsController],
  providers: [ParentsService]
})
export class ParentsModule { }
