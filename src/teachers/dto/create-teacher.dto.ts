import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength, isString } from "@nestjs/class-validator";

export class CreateTeacherDto {
    @IsNotEmpty()
    @IsNumber()
    nik: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    degree_id: number;

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
    @IsDate()
    place_birth: string;

    @IsNotEmpty()
    @IsNumber()
    gender_id: number;

    @IsNotEmpty()
    @IsNumber()
    religion_id: number;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsDate()
    entry_year: Date;

    @IsNotEmpty()
    @IsString()
    address: string;

}
