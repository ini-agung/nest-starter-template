import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateEnrolmentDto {
    @IsNotEmpty()
    @IsString()
    enrol_code: string;

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
    @IsBoolean()
    enrolment_status: boolean;
}
