import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class SigninDto {
    @IsNotEmpty()
    @IsString()
    identity: string;

    @IsNotEmpty()
    @IsString()
    password: string;
  }

  