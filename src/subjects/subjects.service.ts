import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { Pagination } from '@app/helper';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectService: Repository<Subject>,) { }
  private readonly logger = new Logger(SubjectsService.name);

  /**
     * Create a new subject.
     *
     * @param createSubjectDto - Data to create a new subject.
     * @returns The created subject.
     * @throws ConflictException if there's an error while creating the subject.
     */
  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const classroom = this.subjectService.create(createSubjectDto);
      return await this.subjectService.save(classroom);
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
  * Update an existing subject.
  *
  * @param id - ID of the subject to update.
  * @param updateSubjectDto - Updated subject data.
  * @returns The updated subject.
  * @throws ConflictException if the subject doesn't exist or there's an error during update.
  */
  async findLike(
    id: number,
    subject: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.subjectService
        .createQueryBuilder('subject')
        .select([
          'subject.id', 'subject.subject', 'subject.description'
        ])
        .orderBy('subject.subject', 'ASC')
        .where('subject.deletedAt IS NULL')
      if (subject) {
        queryBuilder.andWhere('((subject.subject LIKE :subject) OR (subject.description LIKE :subject))', { subject: `%${subject}%` })
      }
      const subjects = await queryBuilder.orderBy('subject.id', 'ASC').getMany();
      this.logger.log(subjects);
      const total = subjects.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = subjects.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/subjects?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/subjects?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find subjects : ${error.message}`);
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

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    try {
      const subject = await this.subjectService.findOneBy({ id });
      if (!subject.subject) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `subject with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(subject.subject, updateSubjectDto.subject);
      return this.subjectService.save(subject);
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

  async remove(id: number) {
    try {
      const classroom = await this.subjectService.findOneBy({ id });
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
      return this.subjectService.save(classroom);
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

  async restore(id: number): Promise<Subject> {
    try {
      const classroomToRestore = await this.subjectService
        .createQueryBuilder('classroom')
        .withDeleted() // Include soft-deleted entities
        .where('classroom.id = :id', { id })
        .getOne();

      if (classroomToRestore) {
        classroomToRestore.deletedAt = null; // Set deletedAt back to null
        return this.subjectService.save(classroomToRestore);
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
