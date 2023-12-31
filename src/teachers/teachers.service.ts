import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Pagination } from '@app/helper';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) { }
  private readonly logger = new Logger(TeachersService.name);

  /**
     * Create a new teacher.
     *
     * @param createTeacherDto - Data to create a new teacher.
     * @returns The created teacher.
     * @throws ConflictException if there's an error while creating the teacher.
     */
  async create(createTeacherDto: CreateTeacherDto) {
    try {
      const teacher = await this.teachersRepository.create(createTeacherDto);
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


  /**
   * Retrieve teachers based on query parameters.
   *
   * @param nik - Filter by teacher's National Identification Number (NIK).
   * @param name - Filter by teacher's full name.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns An array of teachers that match the query criteria.
   * @throws ConflictException if there's an error while retrieving teachers.
   */
  async findLike(
    nik: number,
    name: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.teachersRepository
        .createQueryBuilder('teacher')
        .select([
          'teacher.id',
          'teacher.nik',
          'teacher.full_name',
          'teacher.nick_name',
          'teacher.phone',
          'teacher.date_birth',
          'teacher.place_birth',
          'teacher.entry_year',
        ])
        .leftJoinAndSelect('teacher.degree', 'degree')
        .leftJoinAndSelect('teacher.user', 'users')
        .leftJoinAndSelect('teacher.religion', 'religions')
        .leftJoinAndSelect('teacher.gender', 'genders')
        .where('teacher.deletedAt IS NULL')
        .cache(true)
      if (nik) {
        queryBuilder.andWhere('(teacher.nik LIKE :nik)', { nik: `%${nik}%` })
      }
      if (name) {
        queryBuilder.andWhere('((teacher.full_name LIKE :name) OR (teacher.nick_name LIKE :name))', { name: `%${name}%` })
      }
      // this.logger.log(queryBuilder);
      const teacherCounts = await queryBuilder.orderBy('teacher.nik', 'ASC').getMany();
      const total = teacherCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = teacherCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/students?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/students?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
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

  /**
   * Update an existing teacher.
   *
   * @param id - ID of the teacher to update.
   * @param updateTeacherDto - Updated teacher data.
   * @returns The updated teacher.
   * @throws ConflictException if the teacher doesn't exist or there's an error during update.
   */
  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    try {
      const teacher = await this.teachersRepository.findOneBy({ id });
      if (!teacher) {
        const data = {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
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

  /**
   * Soft-delete a teacher.
   *
   * @param id - ID of the teacher to delete.
   * @returns The soft-deleted teacher.
   * @throws ConflictException if the teacher doesn't exist or there's an error during deletion.
   */
  async remove(id: number) {
    try {
      const teacher = await this.teachersRepository.findOneBy({ id });
      if (!teacher) {
        const data = {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `Teacher with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      // Instead of a hard delete, mark the teacher as deleted (soft delete)
      teacher.deletedAt = new Date();; // Assuming there's a property called "deleted" on the teacher entity
      return await this.teachersRepository.save(teacher); // Save to persist the soft delete
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

  /**
   * Restore a previously soft-deleted teacher.
   *
   * @param id - ID of the teacher to restore.
   * @returns The restored teacher or null if not found.
   * @throws ConflictException if there's an error during restoration.
   */
  async restore(id: number): Promise<Teacher> {
    try {
      const userToRestore = await this.teachersRepository
        .createQueryBuilder('user')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
        .cache(true)
        .getOne();

      if (userToRestore) {
        userToRestore.deletedAt = null; // Set deletedAt back to null
        return this.teachersRepository.save(userToRestore);
      }
      return null; // User not found
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
