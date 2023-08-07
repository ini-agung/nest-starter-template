
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsNumber, IsOptional } from "@nestjs/class-validator";
export class CreateUserDto {
    @IsNumber()
    @IsOptional()
    role_id: number = 1;

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

    @IsString()
    @IsOptional()
    img: string = "default.jpg";
}
