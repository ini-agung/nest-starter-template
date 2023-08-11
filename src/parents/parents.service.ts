import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,) { }
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

  async findAll(): Promise<{}> {
    try {
      const fathers = await this.parentsRepository
        .createQueryBuilder('parent')
        .select([
          'parent.id', 'parent.user_id', 'parent.father', 'parent.mother', 'parent.phone_father',
          'parent.phone_mother', 'parent.img_mother', 'parent.img_father', 'parent.address',
        ])
        .leftJoinAndSelect('parent.rf', 'religion as religion_father')
        .leftJoinAndSelect('parent.rm', 'religion as religion_mother')
        // .leftJoinAndMapMany('parent.students', 'students', 'students', 'students.parent_id = parent_id')  // Join students using parent_id
        .leftJoinAndMapMany(
          'parent.students',
          'students',
          'students',
          'students.parent_id = parent_id AND students.parent_id = parent.id'  // Join students using parent_id and match parent_id with parent.id
        )
        .where('parent.deletedAt IS NULL')
        .getMany();
      this.logger.log(fathers);
      const flattenedFathers = fathers.map(parent => ({
        parent_id: parent.id,
        user_id: parent.user_id,
        father: {
          name: parent.father,
          phone: parent.phone_father,
          img: parent.img_father,
          religion: parent.rf.religion,
        },
        mother: {
          name: parent.mother,
          phone: parent.phone_mother,
          img: parent.img_mother,
          religion: parent.rm.religion,
        },
      }));
      return fathers;
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

  async findOne(id: number): Promise<Parent> {
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
