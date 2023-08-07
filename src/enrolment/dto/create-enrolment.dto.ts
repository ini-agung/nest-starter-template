import { IsDate, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateEnrolmentDto {
    @IsNotEmpty()
    @IsString()
    enrol_code: number;

    @IsNotEmpty()
    @IsNumber()
    student_id: number;

    @IsNotEmpty()
    @IsNumber()
    class_id: number;

    @IsNotEmpty()
    @IsDate()
    enrolment_date: Date;

    @IsNotEmpty()
    @IsNumber()
    enrolment_status: number;
}
