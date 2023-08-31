import { ConflictException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { MetadataDto } from './dto/metadata.dto';
import { hashPassword } from '@app/jwt-libs';
import { InjectRepository } from '@nestjs/typeorm';
import { captureSentryException } from '@app/helper';


@Injectable()
export class AuthService {
  constructor(private readonly connection: Connection, private readonly userService: UsersService,
    @InjectRepository(MetadataDto)
    private metadataRepository: Repository<MetadataDto>,) { }

  /**
 * Create a new metadata.
 *
 * @param metadataDto - Data to create a new metadata.
 * @returns Created metadata data.
 */
  async metadata(metadataDto: MetadataDto) {
    try {
      const metadata = this.metadataRepository.create(metadataDto);
      return await this.metadataRepository.save(metadata);
    } catch (error) {
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
