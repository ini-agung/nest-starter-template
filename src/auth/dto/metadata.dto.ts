import { IsDate, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { IsNumber } from "class-validator";

export class MetadataDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsDate()
  login_timestamp: Date;

  @IsNotEmpty()
  @IsString()
  ip_address: string;

  @IsNotEmpty()
  @IsString()
  user_agent: string;

  @IsNotEmpty()
  @IsString()
  device_information: string;
}

