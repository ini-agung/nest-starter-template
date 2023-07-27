import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { hashPassword } from '@app/jwt-libs';
import { Connection } from 'typeorm';

@Injectable()
export class ClassroomsService {
  constructor(private readonly connection: Connection){}
  async create(createClassroomDto: CreateClassroomDto,) {
    const query = `
    INSERT INTO users
    (username, fullname, email, password, img)
    VALUES( ?, ?, ?, ?, ?);
    `;
    try {
    //   const password = await hashPassword(createClassroomDto);
    //   const result = await this.connection.query(query, [createClassroomDto.username, createClassroomDto.fullname, createClassroomDto.email, password, createClassroomDto.img]);    
    //   return result;
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
    return `This action returns all classrooms`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} classroom`;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    return `This action updates a #${id} classroom`;
  }

  async remove(id: number) {
    return `This action removes a #${id} classroom`;
  }
}
