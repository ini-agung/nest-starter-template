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

  async findAll(page: number = 1, limit: number = 10): Promise<Pagination<any>> {
    try {
      const teachers = await this.teachersRepository
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
        .where('users.deletedAt IS NULL')
        .getMany();
      this.logger.log(teachers);
      const flattenedTeachers = teachers.map(teacher => ({
        user_id: teacher?.user?.id,
        teacher_id: teacher?.id,
        nik: teacher?.nik,
        username: teacher?.user?.username,
        email: teacher?.user?.email,
        full_name: teacher?.full_name,
        nick_name: teacher?.nick_name,
        date_birth: teacher?.date_birth,
        place_birth: teacher?.place_birth,
        religion: teacher?.religion?.religion,
        entry_year: teacher?.entry_year,
        gender: teacher?.gender?.gender,
        phone: teacher?.phone,
        degree: teacher?.degree?.degree, // Access the 'degree' property directly
      }));
      const total = flattenedTeachers.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = flattenedTeachers.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/parents?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/parents?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find all ${error.message}`);
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
    nik: number,
    full_name: string,
    nick_name: string,
    page: number = 1,
    limit: number = 10): Promise<any[]> {
    try {
      const teachers = await this.teachersRepository
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
      if (nik) {
        teachers.where('(teacher.nik LIKE :nik)', { nik: `%${nik}%` })
      }
      if (full_name) {
        teachers.where('teacher.full_name = :full_name', { full_name })
      }
      if (nick_name) {
        teachers.where('teacher.nick_name = :nick_name', { nick_name })
      }
      this.logger.log(teachers);
      const schedulesCounts = await teachers.getRawMany();
      return schedulesCounts;
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

  async restore(id: number): Promise<Teacher> {
    try {
      const userToRestore = await this.teachersRepository
        .createQueryBuilder('user')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
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
