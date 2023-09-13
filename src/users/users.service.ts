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
import { Pagination, captureSentryException } from '@app/helper';
import { RolePermission, UserPermission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(RolePermission)
    private rpRepository: Repository<RolePermission>,
    @InjectRepository(UserPermission)
    private upRepository: Repository<UserPermission>,
  ) {
  }


  /**
   * Create a new user.
   *
   * @param createUserDto - Data to create a new user.
   * @returns Created user data.
   */
  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await hashPassword(createUserDto.password);
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
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Retrieve users based on filters with optional pagination.
   *
   * @param username - Filter by username.
   * @param email - Filter by email.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns Paginated list of filtered user.
   */
  async findAll(
    username: string,
    email: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.username', 'user.createdAt'])
        .leftJoinAndSelect('user.role', 'role')
        .where('user.deletedAt is NULL')
        .cache(true)
      if (username) {
        queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
      }
      if (email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${email}%` });
      }
      const users = await queryBuilder.orderBy('user.id', 'ASC').getMany();
      for (const user of users) {
        let permissions = []
        const up = await this.upRepository
          .createQueryBuilder('up')
          .select(['up.id', 'permission.id', 'permission.code'])
          .leftJoin('up.permission', 'permission')
          .where('up.user_id = :userId', { userId: user.id })
          .cache(true)
          .getRawMany();
        const rp = await this.rpRepository
          .createQueryBuilder('rp')
          .select(['rp.id', 'permission.id', 'permission.code'])
          .leftJoin('rp.permission', 'permission')
          .where('rp.role_id = :role_id', { role_id: user.role.id })
          .cache(true)
          .getRawMany();
        permissions = [...up, ...rp]
        Object.assign(user, { permissions });

        if (user.id == 1) {
          const metadata = await this.studentRepository
            .createQueryBuilder('student')
            .where('student.user_id = :id', { id: user.id })
            .cache(true)
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 2 || user.id == 3 || user.id == 5) {
          const metadata = await this.teacherRepository
            .createQueryBuilder('teacher')
            .where('teacher.user_id = :id', { id: user.id })
            .cache(true)
            .getOne();
          Object.assign(user, { metadata });
        }
        if (user.id == 5) {
          const metadata = await this.parentRepository
            .createQueryBuilder('parent')
            .where('parent.user_id = :id', { id: user.id })
            .cache(true)
            .getOne();
          Object.assign(user, { metadata });
        }
      }
      const total = users.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
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
      captureSentryException(error);
      throw new BadRequestException(data, { cause: new Error() });
    }
  }

  /**
   * Retrieve user based on filters with param.
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
        .cache(true)
        .getOne();

      if (user) {
        let permissions: any = [];
        try {
          const rolePermission = await this.rpRepository
            .createQueryBuilder('rp')
            .select('permission.code', 'code')
            .leftJoin('rp.permission', 'permission')
            .where('rp.role_id = :role_id', { role_id: user.role_id })
            .andWhere('((rp.deletedAt IS NULL)AND(permission.deletedAt IS NULL))')
            .getRawMany();
          permissions.push(rolePermission)
        } catch (error) {
          captureSentryException(error);
        }
        try {
          const userPermission = await this.upRepository
            .createQueryBuilder('up')
            .select('permission.code', 'code')
            .leftJoin('up.permission', 'permission')
            .where('up.user_id = :user_id', { user_id: user.id })
            .getRawMany();
          permissions.push(userPermission)
        } catch (error) {
          captureSentryException(error);
        }
        const flattenedPermissions = permissions.flatMap(row => row.map(item => item.code));
        Object.assign(user, { flattenedPermissions });
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
        message: "user not found",
        data: {}
      };
      this.logger.log("error", error);
      captureSentryException(error);
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
      captureSentryException(error);
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
      captureSentryException(error);
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
        .createQueryBuilder('user')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
        .cache(true)
        .getOne();

      if (userToRestore) {
        userToRestore.deletedAt = null; // Set deletedAt back to null
        return await this.userRepository.save(userToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find user :   ${error.message}`);
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
   * Retrieve users based on filters with optional pagination.
   *
   * @param username - Filter by username.
   * @param email - Filter by email.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns Paginated list of filtered user.
   */
  async findUserPermission(
    page: number,
    limit: number,
    user: string,
    permission: string
  ) {
    try {
      const queryBuilder = await this.upRepository
        .createQueryBuilder('up')
        .select(['up.id', 'up.user_id', 'permission.code', 'permission.description', 'user.email', 'user.username'])
        .leftJoin('up.permission', 'permission')
        .leftJoin('up.user', 'user')
        .where('up.deletedAt is NULL')
        .cache(true)
      if (user) {
        queryBuilder.andWhere('up.user_id = :user', { user });
      }

      if (permission) {
        queryBuilder.andWhere('permission.code = :permission', { permission });
      }
      const userPermissions = await queryBuilder.getMany();
      const groupedPermissions = userPermissions.reduce((result, item) => {
        const userPermission = result.find((p) => p.user_id === item.user_id);
        if (userPermission) {
          this.logger.log(item.user);
          userPermission.permission.push({
            code: item.permission.code,
            description: item.permission.description,
          });
        } else {
          result.push({
            username: item.user.username,
            email: item.user.email,
            user_id: item.user_id,
            permission: [
              {
                code: item.permission.code,
                description: item.permission.description,
              },
            ],
          });
        }
        return result;
      }, []);
      const total = groupedPermissions.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = groupedPermissions.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/users/permission?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/users/permission?page=${(parseInt(page.toString()) + 1)}` : undefined,
      }
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.sqlMessage,
        data: {}
      };
      captureSentryException(error);
      throw new BadRequestException(data, { cause: new Error() });
    }
  }

  /**
   * Find is any combination between user_id and permission_id.
   * @param user_id - Find by user_id.
   * @param permission_id - Find by permission_id.
   * @returns Paginated list of filtered user.
   */
  async checkAndUpdateUP(user_id: number, permission_id: number): Promise<boolean> {
    const queryBuilder = await this.upRepository
      .createQueryBuilder('up')
      .select(['up.id'])
      .where('up.deletedAt is NULL')
      .andWhere('up.user_id =:user_id', { user_id })
      .andWhere('up.permission_id =:permission_id', { permission_id })
      .cache(true)
      .getCount();
    console.log("queryBuilder", queryBuilder);
    if (queryBuilder == 0) {
      console.log("insert")
      return true;
    }
    console.log("sudah ada, return false")
    return false;
  }
}
