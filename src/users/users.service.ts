import { Injectable, BadRequestException, ConflictException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection, Repository } from 'typeorm';
import { hashPassword } from '@app/jwt-libs';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(

    private readonly connection: Connection,
    // @InjectRepository(User)
    // private teachersRepository: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const query = `
    INSERT INTO users (role_id, username, email, password)
    VALUES (?, ?, ?, ?);
    `;
    try {
      const password = await hashPassword(createUserDto.password);
      const result = await this.connection.query(query, [createUserDto.role_id, createUserDto.username, createUserDto.email, password]);
      console.log(result);
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

  async findAll(): Promise<User[]> {
    const query = `
    SELECT users.id, username, email,
    role
    from users
    join roles on users.role_id = roles.id
    where users.deletedAt IS NULL
    ORDER BY users.username ASC;
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
    SELECT
      users.id as users_id, users.username, users.email, users.password, users.createdAt,
      roles.id, roles.role,
      NOW() as current_datetime
    from
      db_spada.users
    LEFT JOIN
      db_spada.roles
    ON
      users.role_id = roles.id
    WHERE
      (users.username = ? OR users.email = ?)
    AND
      users.deletedAt IS NULL;
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
