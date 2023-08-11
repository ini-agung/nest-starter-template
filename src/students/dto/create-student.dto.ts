import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsDate, IsNumber, isNumber, minLength, MaxLength } from "@nestjs/class-validator";
export class CreateStudentDto {
    @IsNotEmpty()
    @IsNumber()
    parent_id: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    nis: number;

    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsString()
    nick_name: string;

    @IsNotEmpty()
    @IsDate()
    date_birth: Date;

    @IsNotEmpty()
    @IsString()
    place_birth: string;


    @IsNotEmpty()
    @IsNumber()
    gender_id: number;

    @IsNotEmpty()
    @IsNumber()
    religion_id: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(12)
    @MaxLength(15)
    phone: string;

    @IsNotEmpty()
    @IsNumber()
    siblings: number;

    @IsNotEmpty()
    @IsNumber()
    child_order: number;

    @IsNotEmpty()
    @IsDate()
    entry_year: Date;

    @IsNotEmpty()
    @IsString()
    img: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}
