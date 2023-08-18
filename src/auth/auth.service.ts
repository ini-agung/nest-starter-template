import { Injectable, Res } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(private readonly connection: Connection, private readonly userService: UsersService) { }
  /**
     * Validates a user's identity and password for authentication.
     * @param signinDto - The DTO containing user's identity and password.
     * @returns A user object if authentication is successful, otherwise null.
     */
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
  /**
     * Registers a new user by checking if the provided username or email is available.
     * @param signupDto - The DTO containing user's registration information.
     * @returns An array of users matching the provided username or email (if available), otherwise an empty array.
     */
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
