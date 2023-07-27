import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtLibsService } from '@app/jwt-libs';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtLibsService]
})
export class AuthModule {}
