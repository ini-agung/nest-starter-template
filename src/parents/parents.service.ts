import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { Pagination } from '@app/helper';
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

  async findAll(page: number, limit: number): Promise<Pagination<any>> {
    try {
      console.log(page, limit);
      const parents = await this.parentsRepository
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
      // this.logger.log(parents);
      const total = parents.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = parents.slice(startIdx, endIdx);

      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/parents?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/parents?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
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

  /**
  * Retrieve students based on filters with optional pagination.
  *
  * @param phone - Filter by phone of father or mother.
  * @param name - Filter by name of father or mother.
  * @param page - Page number for pagination.
  * @param limit - Number of items per page.
  * @returns Paginated list of filtered students.
  */
  async findLike(
    phone: string,
    name: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      console.log(phone, name)
      const queryBuilder = this.parentsRepository
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
      if (phone) {
        queryBuilder.andWhere('((parent.phone_mother LIKE :phone) OR (parent.phone_father LIKE :phone))', { phone: `%${phone}%` });
      }
      if (name) {
        queryBuilder.andWhere('((parent.father LIKE :name) OR (parent.mother LIKE :name))', { name: `%${name}%` });
      }
      const studentsCounts = await queryBuilder.getMany();
      this.logger.log(studentsCounts);
      // const flattenedParents = studentsCounts.map(parent => ({
      //   parent_id: parent.id,
      //   user_id: parent.user_id,
      //   father: {
      //     name: parent.father,
      //     phone: parent.phone_father,
      //     img: parent.img_father,
      //     religion: parent.rf.religion,
      //   },
      //   mother: {
      //     name: parent.mother,
      //     phone: parent.phone_mother,
      //     img: parent.img_mother,
      //     religion: parent.rm.religion,
      //   },
      // }));
      const total = studentsCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = studentsCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/parents?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/parents?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find student :  ${error.message}`);
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
