import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parents } from './entities/parents.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parents)
    private parentsRepository: Repository<Parents>,) { }
  private readonly logger = new Logger(ParentsService.name);

  async create(createParentDto: CreateParentsDto) {
    try {
      const parent = this.parentsRepository.create(createParentDto);
      return await this.parentsRepository.save(parent);
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

  async findAll(): Promise<Parents[]> {
    try {
      return await this.parentsRepository.find();
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

  async findOne(id: number): Promise<Parents> {
    try {
      return await this.parentsRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error find parent :  ${error.message}`);
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

  async update(id: number, updateParentDto: UpdateParentsDto) {
    try {
      const parent = await this.parentsRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(parent, updateParentDto);
      return this.parentsRepository.save(parent);
    } catch (error) {
      this.logger.error(`Error find parent :  ${error.message}`);
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
      const parent = await this.parentsRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      parent.deletedAt = new Date();
      return this.parentsRepository.save(parent);
      return await this.parentsRepository.delete(id);
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
}
