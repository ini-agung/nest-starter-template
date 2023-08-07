import { PartialType } from '@nestjs/swagger';
import { CreateReligionDto } from './create-religion';

export class UpdateReligionDto extends PartialType(CreateReligionDto) { }
