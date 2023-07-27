import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsDate, IsNumber, isNumber, minLength, MaxLength } from "@nestjs/class-validator";
export class CreateStudentDto {
    @IsNotEmpty()
    @IsNumber()
    nis: number;

    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsString()
    nick_name: string; 

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password too weak, combine uppercase, lowercase and digits' })
    password: string;

    @IsDate()
    date_birth: Date;

    @IsString()
    place_birth: string;

    @IsString()
    gender: string;

    @IsString()
    religion: string;

    @IsString()
    @MinLength(12)
    @MaxLength(15)
    phone: string;

    @IsNumber()
    siblings: number;

    @IsNumber()
    child_order: number;
    
    @IsDate()
    entry_year: Date;

    @IsString()
    img: string;

    @IsString()
    address: string;
}
