import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateClassDto {
    @IsNotEmpty()
    @IsString()
    class: string;

    @IsNotEmpty()
    @IsNumber()
    classroom_id: number;

    @IsNotEmpty()
    @IsNumber()
    teacher_id: number;

    @IsNotEmpty()
    @IsNumber()
    subject_id: number;

    @IsNotEmpty()
    @IsNumber()
    max_students: number;
}
