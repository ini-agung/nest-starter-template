
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from "@nestjs/class-validator";

export class CreateReligionDto {
    @IsNotEmpty()
    @IsString()
    religion: string;
}
