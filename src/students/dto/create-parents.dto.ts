import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsDate, IsNumber, isNumber, minLength, MaxLength } from "@nestjs/class-validator";
export class CreateParentsDto {
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
    @IsString()
    address: string;
}