import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { Repository } from 'typeorm';
import { Pagination } from '@app/helper';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,) { }
  private readonly logger = new Logger(ClassService.name);

  /**
     * Create a new class.
     *
     * @param createclassDto - Data to create a new class.
     * @returns The created class.
     * @throws ConflictException if there's an error while creating the class.
     */
  async create(createclassDto: CreateClassDto) {
    try {
      const classes = this.classRepository.create(createclassDto);
      return await this.classRepository.save(classes);
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

  /**
   * Retrieve all classs with pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns A paginated list of classs.
   * @throws ConflictException if there's an error while retrieving classs.
   */
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.classRepository
        .createQueryBuilder('class')
        .select([
          'class.id', 'class.class'
        ])
        .orderBy('class.class', 'ASC')
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
        prevPage: page > 1 ? `/classs?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/classs?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find classs : ${error.message}`);
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
    classes: string,
    page: number,
    limit: number,
  ) {
    try {

    } catch (error) {

    }
    return [];
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    try {
      const classes = await this.classRepository.findOneBy({ id });
      if (!classes.class) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `class with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(classes.class, updateClassDto.class);
      return this.classRepository.save(classes);
    } catch (error) {
      this.logger.error(`Error find class :  ${error.message}`);
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
      const classes = await this.classRepository.findOneBy({ id });
      if (!classes) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `class with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      classes.deletedAt = new Date();
      return this.classRepository.save(classes);
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

  async restore(id: number): Promise<Class> {
    try {
      const classToRestore = await this.classRepository
        .createQueryBuilder('class')
        .withDeleted() // Include soft-deleted entities
        .where('class.id = :id', { id })
        .getOne();

      if (classToRestore) {
        classToRestore.deletedAt = null; // Set deletedAt back to null
        return this.classRepository.save(classToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find class :   ${error.message}`);
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
