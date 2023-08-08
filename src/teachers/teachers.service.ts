import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teachers } from './entities/teachers.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,) { }
  private readonly logger = new Logger(TeachersService.name);

  async create(createTeacherDto: CreateTeacherDto) {
    try {
      const teacher = this.teachersRepository.create(createTeacherDto);
      return await this.teachersRepository.save(teacher);
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

  async findAll(): Promise<Teachers[]> {
    try {
      return await this.teachersRepository.find();
    } catch (error) {
      this.logger.error(`Error find all ${error.message}`);
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

  async findOne(id: number): Promise<Teachers> {
    try {
      return await this.teachersRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error find teacher :  ${error.message}`);
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

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    try {
      const teacher = await this.teachersRepository.findOneBy({ id });
      if (!teacher) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `Teacher with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(teacher, updateTeacherDto);
      return this.teachersRepository.save(teacher);
    } catch (error) {
      this.logger.error(`Error find teacher :  ${error.message}`);
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
      const teacher = await this.teachersRepository.findOneBy({ id });
      if (!teacher) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `Teacher with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      return await this.teachersRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error find teacher :   ${error.message}`);
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
