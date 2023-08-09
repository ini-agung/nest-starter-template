import { Injectable, Res } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(private readonly connection: Connection, private readonly userService: UsersService) { }

  async validateUser(signinDto: SigninDto): Promise<any> {
    const data = {
      status: false,
      statusCode: 400,
      message: 'user not found',
      data: {}
    };

    const query = ``;

    const user = await this.connection.query(query, [signinDto.identity, signinDto.identity, signinDto.password]);
    return user;

  }

  async signUp(signupDto: SignupDto) {
    const query = `
      SELECT *
      FROM users
      WHERE (username = ? OR email = ? )
      AND deletedAt IS NULL;
    `;
    const checkIdentity = await this.connection.query(query, [signupDto.username, signupDto.email]);
    return checkIdentity;
  }
}
