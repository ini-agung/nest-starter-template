import { Injectable, HttpStatus, ConflictException, Logger } from '@nestjs/common';
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

  async findAll(page: number = 1, limit: number = 10): Promise<Pagination<any>> {
    try {
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

  async findLike(
    nis: number,
    name: string,
    nick_name: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<any>> {
    this.logger.log([nis, name, nick_name]);
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
      queryBuilder.andWhere('student.nis = :nis', { nis });
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
  }

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

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const parent = await this.studentRepository.findOneBy({ id });
      if (!parent) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `parent with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(parent, updateStudentDto);
      return this.studentRepository.save(parent);
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
      const parent = await this.studentRepository.findOneBy({ id });
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
      return this.studentRepository.save(parent);
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
