import { PartialType } from '@nestjs/swagger';
import { CreateParentsDto } from './create-parents.dto';

export class UpdateParentsDto extends PartialType(CreateParentsDto) { }