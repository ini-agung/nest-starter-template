import { IsNotEmpty, IsString, MinLength, IsNumber, MaxLength } from "@nestjs/class-validator";
export class CreateParentsDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    father: string;

    @IsNotEmpty()
    @IsString()
    mother: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(12)
    @MaxLength(15)
    phone_father: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(12)
    @MaxLength(15)
    phone_mother: string;

    @IsNotEmpty()
    @IsString()
    img_father: string;

    @IsNotEmpty()
    @IsString()
    img_mother: string;

    @IsNotEmpty()
    @IsNumber()
    religion_father: number;

    @IsNotEmpty()
    @IsNumber()
    religion_mother: number;

    @IsNotEmpty()
    @IsString()
    address: string;
}