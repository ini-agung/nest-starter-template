
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from "@nestjs/class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    role: string;
}
