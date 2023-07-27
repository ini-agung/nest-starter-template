import { Injectable, HttpStatus, ConflictException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { hashPassword } from '@app/jwt-libs';
import { Connection } from 'typeorm';
@Injectable()
export class StudentsService {
  constructor (private readonly connection: Connection){}
  async create(createStudentDto: CreateStudentDto) {
    const query = `
    INSERT INTO students (
      nis, full_name, nick_name,
      email, password, child_order,
      date_birth, place_birth, gender,
      phone, entry_year, img, religion,
      siblings, address)
    VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const password = await hashPassword(createStudentDto.password);
      const result = await this.connection.query(query,[
          createStudentDto.nis,
          createStudentDto.full_name,
          createStudentDto.nick_name,
          createStudentDto.email,
          password,
          createStudentDto.child_order,
          createStudentDto.date_birth,
          createStudentDto.place_birth,
          createStudentDto.gender,
          createStudentDto.phone,
          createStudentDto.entry_year,
          createStudentDto.img,
          createStudentDto.religion,
          createStudentDto.siblings,
          createStudentDto.address,
        ]);
      return result;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data:{}
      };
      throw new ConflictException(data, {cause: new Error()});
    }
  }

  async findAll() {
    const query = `
    SELECT
      id, nis, full_name, nick_name,
      email, password, child_order,
      date_birth, place_birth, gender,
      phone, entry_year, img, religion,
      siblings, address
    FROM students
    WHERE deletedAt IS NULL
    ORDER BY nis ASC;
    `;
    try {
      const result = await this.connection.query(query)
      return result;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data:{}
      };
      throw new ConflictException(data, {cause: new Error()});
    }
  }

  async findOne(identity: any) {
    const query = `
    SELECT
      id, nis, full_name, nick_name,
      email, password, child_order,
      date_birth, place_birth, gender,
      phone, entry_year, img, religion,
      siblings, address
    FROM students
    WHERE (nis = ? OR full_name = ? OR nick_name = ? OR email = ?)
    AND deletedAt IS NULL
    `;
    try {
      const result = await this.connection.query(query, [identity, identity, identity, identity]);
      return result;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data:{}
      };
      throw new ConflictException(data, {cause: new Error()});
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  async remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
