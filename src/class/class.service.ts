import { ConflictException, BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
   * Retrieve classes based on filters with optional pagination.
   *
   * @param id - Filter by classes's id.
   * @param classes - Filter by classes's name.
   * @param page - Page number for pagination.
   * @param limit - Number of items per page.
   * @returns Paginated list of filtered classes.
   */
  async findLike(
    id: number,
    classes: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.classRepository
        .createQueryBuilder('class')
        .select([
          'class.id', 'class.class', 'class.max_students',
          'cr.classroom',
          't.nik', 't.full_name',
          'degree.degree',
          'user.email', 'user.username',
          'subject.subject',
          'schedule.id', 'schedule.schedule_code', 'schedule.time_start', 'schedule.time_finish',
        ])
        .leftJoin('class.classroom', 'cr')
        .leftJoin('class.teacher', 't')
        .leftJoin('class.subject', 'subject')
        .leftJoin('t.degree', 'degree')
        .leftJoin('t.user', 'user')
        .leftJoin('class.schedules', 'schedule', 'schedule.class_id = class.id')
        .orderBy('class.class', 'ASC')
        .where('class.deletedAt IS NULL')
        .andWhere('cr.deletedAt IS NULL')
        .andWhere('subject.deletedAt IS NULL')
        .andWhere('user.deletedAt IS NULL')
        .andWhere('schedule.deletedAt IS NULL')
      if (classes) {
        queryBuilder.andWhere('(class.class LIKE :classes)', { classes: `%${classes}%` })
      }
      if (id) {
        queryBuilder.andWhere('(class.id = :id)', { id: id })
      }
      // this.logger.log(queryBuilder);
      const classroomCounts = await queryBuilder.orderBy('class.id', 'ASC').getMany();
      const total = classroomCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = classroomCounts.slice(startIdx, endIdx);
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

  /**
   * Update an existing class.
   *
   * @param id - ID of the class to update.
   * @param updateClassDto - Updated class data.
   * @returns The updated class.
   * @throws ConflictException if the class doesn't exist or there's an error during update.
   */
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

  /**
   * Soft-delete a class.
   *
   * @param id - ID of the class to delete.
   * @returns The soft-deleted class.
   * @throws ConflictException if the class doesn't exist or there's an error during deletion.
   */
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
        throw new BadRequestException(data, { cause: new Error() });
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

  /**
   * Restore a previously soft-deleted class.
   *
   * @param id - ID of the class to restore.
   * @returns The restored class or null if not found.
   * @throws ConflictException if there's an error during restoration.
   */
  async restore(id: number): Promise<Class> {
    try {
      const classToRestore = await this.classRepository
        .createQueryBuilder('class')
        .withDeleted() // Include soft-deleted entities
        .where('class.id = :id', { id })
        .andWhere('class.deletedAt IS NOT NULL')
        .getOne();
      console.log(classToRestore)
      if (classToRestore) {
        classToRestore.deletedAt = null; // Set deletedAt back to null
        return this.classRepository.save(classToRestore);
      }
      return null;
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
