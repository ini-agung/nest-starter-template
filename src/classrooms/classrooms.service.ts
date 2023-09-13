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

  /**
     * Create a new classroom.
     *
     * @param createClassroomDto - Data to create a new classroom.
     * @returns The created classroom.
     * @throws ConflictException if there's an error while creating the classroom.
     */
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

  /**
   * Retrieve classrooms based on filters with optional pagination.
   *
   * @param id - Filter by classroom's id.
   * @param classroom - Filter by classroom's name.
   * @param page - Page number for pagination.
   * @param limit - Number of items per page.
   * @returns Paginated list of filtered classrooms.
   */
  async findLike(
    id: number,
    classroom: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.classroomRepository
        .createQueryBuilder('classroom')
        .select([
          'classroom.id', 'classroom.classroom'
        ])
        .orderBy('classroom.classroom', 'ASC')
        .where('classroom.deletedAt IS NULL')
        .cache(true)
      if (classroom) {
        queryBuilder.andWhere('(classroom.classroom LIKE :nik)', { classroom: `%${classroom}%` })
      }
      if (id) {
        queryBuilder.andWhere('(classroom.id = :id)', { id: { id } })
      }
      // this.logger.log(queryBuilder);
      const classroomCounts = await queryBuilder.orderBy('classroom.id', 'ASC').getMany();
      const total = classroomCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = classroomCounts.slice(startIdx, endIdx);
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

  /**
   * Update an existing classroom.
   *
   * @param id - ID of the classroom to update.
   * @param updateClassroomDto - Updated classroom data.
   * @returns The updated classroom.
   * @throws ConflictException if the classroom doesn't exist or there's an error during update.
   */
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

  /**
   * Soft-delete a classroom.
   *
   * @param id - ID of the classroom to delete.
   * @returns The soft-deleted classroom.
   * @throws ConflictException if the classroom doesn't exist or there's an error during deletion.
   */
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

  /**
   * Restore a previously soft-deleted classroom.
   *
   * @param id - ID of the classroom to restore.
   * @returns The restored classroom or null if not found.
   * @throws ConflictException if there's an error during restoration.
   */
  async restore(id: number): Promise<Classroom> {
    try {
      const classroomToRestore = await this.classroomRepository
        .createQueryBuilder('classroom')
        .withDeleted() // Include soft-deleted entities
        .where('classroom.id = :id', { id })
        .cache(true)
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
