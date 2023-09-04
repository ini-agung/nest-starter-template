import { IsNotEmpty, IsNumber, IsString, Matches } from "@nestjs/class-validator";

export class CreateMetadataScheduleDto {
    @IsNotEmpty()
    @IsNumber()
    schedule_id: number;

    @IsNotEmpty()
    @IsString()
    day_of_week: string;

    @IsString()
    matery: string;

    @IsString()
    first_file: string;

    @IsString()
    second_file: string;

    @IsString()
    third_file: string;

    @IsString()
    ex_source: string;

}