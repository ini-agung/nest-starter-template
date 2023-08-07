import { Injectable, BadRequestException, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection } from 'typeorm';
import { hashPassword } from '@app/jwt-libs';

@Injectable()
export class UsersService {
  constructor(private readonly connection: Connection) { }
  async create(createUserDto: CreateUserDto) {
    const query = `
    INSERT INTO users
    (username, email, password)
    VALUES( ?, ?, ?);
    `;
    try {
      const password = await hashPassword(createUserDto.password);
      const result = await this.connection.query(query, [createUserDto.username, createUserDto.email, password]);
      console.log(result);
      const querySwitch = `
      INSERT INTO students
      (id_user)
      VALUES (?)
      `;
      await this.connection.query(querySwitch, [result.insertId]);

      return result;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  async findAll() {
    const query = `
    SELECT id, username, email
    from users
    where deletedAt IS NULL
    ORDER BY username ASC;
    `;
    try {
      const users = await this.connection.query(query);
      return users;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: error.sqlMessage,
        data: {}
      };
      throw new NotFoundException(data, { cause: new Error() });
    }
  }

  async findOne(identity: string) {
    const query = `
    SELECT id, username, fullname, email, password
    from users
    where (username = ? OR email = ?)
    AND deletedAt IS NULL;
    `;
    try {
      const user = await this.connection.query(query, [identity, identity]);
      return user;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: error.sqlMessage,
        data: {}
      };
      throw new NotFoundException(data, { cause: new Error() });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const query = `
    UPDATE users
    SET password = ?,
    WHERE id = ?;
    `;
    try {
      const user = await this.connection.query(query, [updateUserDto.password, id]);
      return user;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  async remove(id: number) {
    const query = `
    UPDATE users
    SET deletedAt = now()
    WHERE id = ?;
    `;
    try {
      const user = await this.connection.query(query, [id]);
      return user;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
