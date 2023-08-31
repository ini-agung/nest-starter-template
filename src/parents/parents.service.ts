import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { Pagination, captureSentryException } from '@app/helper';
@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,) { }
  private readonly logger = new Logger(ParentsService.name);

  /**
     * Create a new parent.
     *
     * @param createParentDto - The data to create a new parent.
     * @returns The created parent data.
     */
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
      captureSentryException(error);
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
      const total = studentsCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
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
      captureSentryException(error);
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
     * Retrieve user based on filters with param.
     *
     * @param id - Id Parent.
     * @returns Paginated list of filtered user.
     */
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
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
    * Update an existing parent.
    *
    * @param id - ID of the parent to update.
    * @param updateParentDto - Updated parent data.
    * @returns Updated parent data.
    */
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
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Delete a teacher (soft delete).
   *
   * @param id - ID of the teacher to delete.
   * @returns Deleted teacher data.
   */
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
      return await this.parentsRepository.save(parent);
    } catch (error) {
      this.logger.error(`Error find parent :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
 * Restore a previously soft-deleted parent.
 *
 * @param id - ID of the parent to restore.
 * @returns Restored parent data.
 */
  async restore(id: number): Promise<Parent> {
    try {
      const parentToRestore = await this.parentsRepository
        .createQueryBuilder('parent')
        .withDeleted() // Include soft-deleted entities
        .where('parent.id = :id', { id })
        .getOne();
      if (parentToRestore) {
        parentToRestore.deletedAt = null; // Set deletedAt back to null
        return await this.parentsRepository.save(parentToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find parent :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
