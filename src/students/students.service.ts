import { Injectable, HttpStatus, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Pagination } from '@app/helper';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,) { }
  private readonly logger = new Logger(StudentsService.name);

  private page = process.env.PAGINATION_LIMIT;
  /**
   * Create a new student.
   *
   * @param createStudentDto - Data to create a new student.
   * @returns Created student data.
   */
  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(student);
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
   * Retrieve all students with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns Paginated list of students.
   */
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<any>> {
    try {
      console.log(this.page)
      const students = await this.studentRepository
        .createQueryBuilder('student')
        .select([
          'student.id', 'student.parent_id', 'student.nis', 'student.full_name', 'student.img',
          'student.nick_name', 'student.date_birth', 'student.place_birth', 'student.phone',
          'student.siblings', 'student.child_order', 'student.entry_year', 'student.address',
        ]) // Specify the columns you want
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('student.gender', 'gender')
        .leftJoinAndSelect('student.religion', 'religion as a')
        .leftJoinAndSelect('parent.rf', 'religion as b') // Join parent_religion for father
        .leftJoinAndSelect('parent.rm', 'religion as c') // Join parent_religion for mother
        .where('student.deletedAt IS NULL')
        .getMany();
      const flattenedStudents = students.map(student => ({
        student_id: student?.id,
        user_id: student?.user?.id,
        nis: student?.nis,
        student_name: student?.full_name,
        nick_name: student?.nick_name,
        username: student?.user?.username,
        date_birth: student?.date_birth,
        place_birth: student?.place_birth,
        entry_year: student?.entry_year,
        address: student?.address,
        img: student?.img,
        siblings: student?.siblings,
        child_order: student?.child_order,
        phone: student?.phone,
        religion: student.religion?.religion,
        father: {
          name: student.parent?.father,
          img: student.parent?.img_father,
          religion: student.parent?.rf.religion,
          phone: student.parent?.phone_father,
        },
        mother: {
          name: student.parent?.mother,
          img: student.parent?.img_mother,
          religion: student.parent?.rm.religion,
          phone: student.parent?.phone_mother,
        }
      }));
      const total = flattenedStudents.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = flattenedStudents.slice(startIdx, endIdx);

      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/students?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/students?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find students : ${error.message}`);
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
   * @param nis - Filter by student's National Identity Number (NIS).
   * @param name - Filter by student's name.
   * @param nick_name - Filter by student's nickname.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns Paginated list of filtered students.
   */
  async findLike(
    nis: number,
    name: string,
    nick_name: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<any>> {
    this.logger.log([nis, name, nick_name]);
    try {

      const queryBuilder = await this.studentRepository
        .createQueryBuilder('student')
        .select([
          'student.id', 'student.parent_id', 'student.nis', 'student.full_name', 'student.img',
          'student.nick_name', 'student.date_birth', 'student.place_birth', 'student.phone',
          'student.siblings', 'student.child_order', 'student.entry_year', 'student.address',
        ]) // Specify the columns you want
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('student.gender', 'gender')
        .leftJoinAndSelect('student.religion', 'religion as a')
        .leftJoinAndSelect('parent.rf', 'religion as b') // Join parent_religion for father
        .leftJoinAndSelect('parent.rm', 'religion as c') // Join parent_religion for mother
        .where('student.deletedAt IS NULL')

      if (nis) {
        queryBuilder.andWhere('student.nis LIKE :nis', { nis: `%${nis}%` });
      }
      if (name || nick_name) {
        queryBuilder.andWhere('(student.full_name LIKE :name OR student.nick_name LIKE :nick_name)', { name: `%${name}%`, nick_name: `%${nick_name}%` });
      }
      const studentsCounts = await queryBuilder.getRawMany();
      const total = studentsCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = startIdx + limit;
      const data = studentsCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/students?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/students?page=${(parseInt(page.toString()) + 1)}` : undefined,
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

  /**
   * Retrieve a single student by ID.
   *
   * @param id - ID of the student to retrieve.
   * @returns Student details.
   */
  async findOne(id: number): Promise<any> {
    try {
      // return await this.studentRepository.findOneBy({ id });
      const students = await this.studentRepository
        .createQueryBuilder('student')
        .select([
          'student.id', 'student.parent_id', 'student.nis', 'student.full_name', 'student.img',
          'student.nick_name', 'student.date_birth', 'student.place_birth', 'student.phone',
          'student.siblings', 'student.child_order', 'student.entry_year', 'student.address',
        ]) // Specify the columns you want
        .leftJoinAndSelect('student.user', 'user')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('student.gender', 'gender')
        .leftJoinAndSelect('student.religion', 'religion as a')
        .leftJoinAndSelect('parent.rf', 'religion as b') // Join parent_religion for father
        .leftJoinAndSelect('parent.rm', 'religion as c') // Join parent_religion for mother
        .where('student.deletedAt IS NULL')
        .getMany();
      this.logger.log(students);
      const flattenedStudents = students.map(student => ({
        student_id: student?.id,
        user_id: student?.user?.id,
        nis: student?.nis,
        student_name: student?.full_name,
        nick_name: student?.nick_name,
        username: student?.user?.username,
        date_birth: student?.date_birth,
        place_birth: student?.place_birth,
        entry_year: student?.entry_year,
        address: student?.address,
        img: student?.img,
        siblings: student?.siblings,
        child_order: student?.child_order,
        phone: student?.phone,
        religion: student.religion?.religion,
        father: {
          name: student.parent?.father,
          img: student.parent?.img_father,
          religion: student.parent?.rf.religion,
          phone: student.parent?.phone_father,
        },
        mother: {
          name: student.parent?.mother,
          img: student.parent?.img_mother,
          religion: student.parent?.rm.religion,
          phone: student.parent?.phone_mother,
        }
      }));
      return flattenedStudents;
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
   * Update an existing student.
   *
   * @param id - ID of the student to update.
   * @param updateStudentDto - Updated student data.
   * @returns Updated student data.
   */
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOneBy({ id });
      if (!student) {
        const data = {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: `student with id ${id} is doesnt exists`,
          data: {}
        };
        throw new BadRequestException(data, { cause: new Error() });
      }
      Object.assign(student, updateStudentDto);
      return this.studentRepository.save(student);
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
   * Delete a student (soft delete).
   *
   * @param id - ID of the student to delete.
   * @returns Deleted student data.
   */
  async remove(id: number) {
    try {
      const student = await this.studentRepository.findOneBy({ id });
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
      return this.studentRepository.save(student);
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
   * Restore a previously soft-deleted student.
   *
   * @param id - ID of the student to restore.
   * @returns Restored student data.
   */
  async restore(id: number): Promise<Student> {
    try {
      const studentToRestore = await this.studentRepository
        .createQueryBuilder('student')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
        .getOne();

      if (studentToRestore) {
        studentToRestore.deletedAt = null; // Set deletedAt back to null
        return this.studentRepository.save(studentToRestore);
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
