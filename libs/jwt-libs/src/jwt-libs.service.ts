import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


export const JWTConstants = {
  secret: process.env.JWT_SECRET || '=+-!@_2024_MY_default_SECRET_2024_@!-+=',
  exp: process.env.JWT_EXPIRES || '8h',
}

export async function hashPassword(password: string): Promise<string> {
  const saltOrRounds = 12; // Adjust this value based on your needs
  return await bcrypt.hash(password, saltOrRounds);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

@Injectable()
export class JwtLibsService {
  constructor(private jwtService: JwtService) { }

  async generateToken(payload: object) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: JWTConstants.exp })
    return { access_token, refresh_token };
  }

  async generateRefresh(payload: object) {
    return await this.jwtService.signAsync(payload);
  }

  async decodeJwt(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}

