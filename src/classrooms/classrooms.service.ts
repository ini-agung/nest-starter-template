import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { Pagination } from '@app/helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,) { }
  private readonly logger = new Logger(ClassroomsService.name);

  async create(createClassroomDto: CreateClassroomDto) {
    try {
      const classroom = this.classroomRepository.create(createClassroomDto);
      return await this.classroomRepository.save(classroom);
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

  async findAll(
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const queryBuilder = await this.classroomRepository
        .createQueryBuilder('classroom')
        .select([
          'classroom.id', 'classroom.classroom'
        ])
        .orderBy('classroom.classroom', 'ASC')
        .getMany();
      const total = queryBuilder.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = queryBuilder.slice(startIdx, endIdx);

      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/classrooms?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/classrooms?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find classrooms : ${error.message}`);
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

  async findLike(
    id: number,
    classroom: string,
    page: number = 1,
    limit: number = 10
  ) {
    return [];
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    try {
      const classroom = await this.classroomRepository.findOneBy({ id });
      if (!classroom.classroom) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `classroom with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(classroom.classroom, updateClassroomDto.classroom);
      return this.classroomRepository.save(classroom);
    } catch (error) {
      this.logger.error(`Error find classroom :  ${error.message}`);
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

  async remove(id: number) {
    try {
      const classroom = await this.classroomRepository.findOneBy({ id });
      if (!classroom) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `classroom with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      classroom.deletedAt = new Date();
      return this.classroomRepository.save(classroom);
    } catch (error) {
      this.logger.error(`Error find parent :   ${error.message}`);
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

  async restore(id: number): Promise<Classroom> {
    try {
      const classroomToRestore = await this.classroomRepository
        .createQueryBuilder('classroom')
        .withDeleted() // Include soft-deleted entities
        .where('classroom.id = :id', { id })
        .getOne();

      if (classroomToRestore) {
        classroomToRestore.deletedAt = null; // Set deletedAt back to null
        return this.classroomRepository.save(classroomToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find classroom :   ${error.message}`);
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

}
