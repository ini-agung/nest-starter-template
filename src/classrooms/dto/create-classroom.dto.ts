import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CreateClassroomDto {
    @IsNotEmpty()
    @IsString()
    classroom: string;
}
