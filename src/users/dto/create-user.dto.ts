
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password too weak, combine uppercase, lowercase and digits' })
    password: string;

}
