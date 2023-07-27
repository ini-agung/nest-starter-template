import { Injectable , BadRequestException, ConflictException, HttpStatus} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection } from 'typeorm';
import { hashPassword } from '@app/jwt-libs';

@Injectable()
export class UsersService {
  constructor (private readonly connection: Connection){}
  async create(createUserDto: CreateUserDto) {
    const query = `
    INSERT INTO users
    (username, fullname, email, password, img)
    VALUES( ?, ?, ?, ?, ?);
    `;
    try {
      const password = await hashPassword(createUserDto.password);
      const result = await this.connection.query(query, [createUserDto.username, createUserDto.fullname, createUserDto.email, password, createUserDto.img]);    
      return result;
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data:{}
      };
      throw new ConflictException(data, {cause: new Error()})
    }
  }

  async findAll() {
    const query = `
    SELECT id, username, fullname, email, password, img
    from users
    where deletedAt IS NULL;
    `;
    const users = await this.connection.query(query);
    return users;
  }

  async findOne(identity: string) {
    const query = `
    SELECT id, username, fullname, email, password
    from users
    where (username = ? OR email = ?)
    AND deletedAt IS NULL;
    `;
    const user = await this.connection.query(query, [identity, identity]);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
