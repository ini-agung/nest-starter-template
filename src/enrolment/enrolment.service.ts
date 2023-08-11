import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/classrooms/entities/classroom.entity';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

  ) { }
  private readonly logger = new Logger(EnrolmentService.name);

  async create(createEnrolmentDto: CreateEnrolmentDto) {
    try {
      const parent = this.enrolmentRepository.create(createEnrolmentDto);
      return await this.enrolmentRepository.save(parent);
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

  async findAll() {
    // return await this.enrolmentRepository.find();
    try {

      const enrolmentCounts = await this.enrolmentRepository
        .createQueryBuilder('enrolment')
        .select('enrolment.class_id', 'class_id')
        .addSelect('COUNT(enrolment.student_id)', 'count')
        .groupBy('enrolment.class_id')
        .getRawMany();

      const result = await Promise.all(
        enrolmentCounts.map(async (item) => {
          // const classes = await this.classRepository.findBy({ id: item.class_id });

          const students = await this.enrolmentRepository
            .createQueryBuilder('enrolment')
            .select('enrolment.student_id', 'student_id')
            .addSelect('student.nis', 'nis')
            .addSelect('student.full_name', 'full_name')
            .addSelect('user.email', 'email')
            .addSelect('classes.id', 'class_id')
            .addSelect('classes.class', 'className')
            .addSelect('classes.max_students', 'max_students')
            .addSelect('classrooms.classroom', 'classroom')
            .addSelect('teacher.id', 'teacher_id')
            .addSelect('teacher.nik', 'nik')
            .addSelect('teacher.full_name', 'teacher')
            .leftJoin('students', 'student', 'student.id = enrolment.student_id')
            .leftJoin('student.user', 'user') // Join with the "users" table
            .leftJoin('enrolment.classes', 'classes')
            .leftJoin('classes.classroom', 'classrooms')
            .leftJoin('classes.teacher', 'teacher')
            .where('enrolment.class_id = :classId', { classId: item.class_id })
            .getRawMany();

          return {
            class_id: item.class_id,
            count: item.count,
            students: students,
          };
        })
      );

      return result;


      // const enrolments = await this.enrolmentRepository
      //   .createQueryBuilder('enrolment')
      //   .select('DISTINCT enrolment.class_id', 'class_id')
      //   .addSelect('student_id')
      //   .getRawMany();

      // console.log(enrolments);
      // const enrolmentWithClassDetails = await Promise.all(enrolments.map(async (item) => {
      //   const enrolmentCounts = await this.enrolmentRepository
      //     .createQueryBuilder('enrolment')
      //     .select([
      //       'COUNT(enrolment.id) AS enrolment_count',
      //     ])
      //     .groupBy('enrolment.class_id')
      //     .getRawMany();
      //   const classDetails = await this.classRepository.findOneBy({ id: item.class_id });
      //   const studentDetails = await this.studentRepository.findBy({ id: item.student_id });
      //   return {
      //     ...item,
      //     totalStudent: enrolmentCounts,
      //     class: classDetails,
      //     students: studentDetails,
      //   };
      // }));

      // return enrolmentWithClassDetails;

      // const enrolments = await this.enrolmentRepository
      //   .createQueryBuilder('enrolment')
      //   .select([
      //     'classes.id AS class_id',
      //     'COUNT(enrolment.id) AS enrolment_count',
      //   ])
      //   .innerJoin('enrolment.classes', 'classes')
      //   .groupBy('classes.id')
      //   .getRawMany();
      // this.logger.log(enrolments);
      // const flattenedEnrolments = enrolments.map(enrolment => ({
      //   enrolment_id: enrolment.id,
      //   enrolment_code: enrolment.enrol_code,
      //   class_id: enrolment.class_id,
      //   enrolment_date: enrolment.enrolment_date,

      // }));
      // return enrolments;

    } catch (error) {
      this.logger.error(`Error find parents : ${error.message}`);
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

  findOne(id: number) {
    return `This action returns a #${id} enrolment`;
  }

  update(id: number, updateEnrolmentDto: UpdateEnrolmentDto) {
    return `This action updates a #${id} enrolment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrolment`;
  }
}
