import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateSubjectDto {
    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
