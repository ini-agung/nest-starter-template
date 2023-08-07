import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateDegreeDto {
    @IsNotEmpty()
    @IsString()
    degree: string;
}
