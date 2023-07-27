import { Module } from '@nestjs/common';
import { JwtLibsService, JWTConstants } from './jwt-libs.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({
    global: true,
    secret: JWTConstants.secret,
    signOptions: {expiresIn: JWTConstants.exp},
  })],
  providers: [JwtLibsService],
  exports: [JwtLibsService],
})
export class JwtLibsModule {}
