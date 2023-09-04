import { IsNotEmpty, IsNumber, IsString, Matches } from "@nestjs/class-validator";

export class CreateScheduleDto {
    @IsNotEmpty()
    @IsString()
    schedule_code: string;

    @IsNotEmpty()
    @IsString()
    day_of_week: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Invalid time format. Please use HH:mm:ss format.',
    })
    time_start: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Invalid time format. Please use HH:mm:ss format.',
    })
    time_finish: string;

    @IsNotEmpty()
    @IsNumber()
    class_id: number;
}

export class CreateMetadataScheduleDto {

}
