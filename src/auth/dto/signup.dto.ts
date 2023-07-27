import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from "@nestjs/class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;

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

    @IsNotEmpty()
    @IsString()
    img: string;
}
