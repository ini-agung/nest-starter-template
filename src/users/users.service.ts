import { Injectable, BadRequestException, ConflictException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection, Repository } from 'typeorm';
import { hashPassword } from '@app/jwt-libs';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Pagination } from '@app/helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) { }

  private readonly logger = new Logger(UsersService.name);

  /**
   * Create a new user.
   *
   * @param createUserDto - Data to create a new user.
   * @returns Created user data.
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
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
   * Retrieve user based on filters with optional pagination.
   *
   * @param username - Filter by username.
   * @param email - Filter by email.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns Paginated list of filtered user.
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    username: string,
    email: string
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.username', 'user.createdAt'])
        .leftJoinAndSelect('user.role', 'role')
        .where('user.deletedAt is NULL')
      if (username) {
        queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
      }
      if (email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
      }
      const users = await queryBuilder.getMany();
      for (const user of users) {
        if (user.id == 1) {
          const metadata = await this.studentRepository
            .createQueryBuilder('student')
            .where('student.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 2 || user.id == 3 || user.id == 5) {
          const metadata = await this.teacherRepository
            .createQueryBuilder('teacher')
            .where('teacher.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 5) {
          const metadata = await this.parentRepository
            .createQueryBuilder('parent')
            .where('parent.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
      }
      const total = users.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = users.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/students?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/students?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.sqlMessage,
        data: {}
      };
      throw new BadRequestException(data, { cause: new Error() });
    }
  }
  /**
   * Retrieve user based on filters with optional pagination.
   *
   * @param identity - Identity can be email or username.
   * @returns Paginated list of filtered user.
   */
  async findOne(identity: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.username=:identity', { identity })
        .orWhere('user.email=:identity', { identity })
        .andWhere('user.deletedAt is NULL')
        .getOne()
      if (user) {
        if (user.id == 1) {
          const metadata = await this.studentRepository
            .createQueryBuilder('student')
            .where('student.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 2 || user.id == 3 || user.id == 5) {
          const metadata = await this.teacherRepository
            .createQueryBuilder('teacher')
            .where('teacher.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 5) {
          const metadata = await this.parentRepository
            .createQueryBuilder('parent')
            .where('parent.user_id = :id', { id: user.id })
            .getOne();
          Object.assign(user, { metadata });
        }
        return user;
      } else {
        const data = {
          status: false,
          statusCode: HttpStatus.BAD_GATEWAY,
          message: "error.sqlMessage",
          data: {}
        };
        throw new BadRequestException(data, { cause: new Error() });
      }
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.sqlMessage,
        data: {}
      };
      throw new BadRequestException(data, { cause: new Error() });
    }
  }

  /**
     * Update an existing user.
     *
     * @param id - ID of the user to update.
     * @param updateUserDto - Updated user data.
     * @returns Updated user data.
     */
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const student = await this.userRepository.findOneBy({ id });
      if (!student) {
        const data = {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `student with id ${id} is doesnt exists`,
          data: {}
        };
        throw new BadRequestException(data, { cause: new Error() });
      }
      Object.assign(student, updateUserDto);
      return this.userRepository.save(student);
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
  /**
   * Delete a user (soft delete).
   *
   * @param id - ID of the user to delete.
   * @returns Deleted user data.
   */
  async remove(id: number) {
    try {
      const student = await this.userRepository.findOneBy({ id });
      if (!student) {
        const data = {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `student with id ${id} is doesnt exists`,
          data: {}
        };
        throw new BadRequestException(data, { cause: new Error() });
      }
      student.deletedAt = new Date();
      return this.userRepository.save(student);
    } catch (error) {
      this.logger.error(`Error find student :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }
  /**
   * Restore a previously soft-deleted user.
   *
   * @param id - ID of the user to restore.
   * @returns Restored user data.
   */
  async restore(id: number): Promise<User> {
    try {
      const userToRestore = await this.userRepository
        .createQueryBuilder('student')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
        .getOne();

      if (userToRestore) {
        userToRestore.deletedAt = null; // Set deletedAt back to null
        return await this.userRepository.save(userToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find student :   ${error.message}`);
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

