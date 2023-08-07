import { Injectable } from '@nestjs/common';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
@Injectable()
export class ParentsService {
  create(createParentDto: CreateParentsDto) {
    return 'This action adds a new parent';
  }

  findAll() {
    return `This action returns all parents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parent`;
  }

  update(id: number, updateParentDto: UpdateParentsDto) {
    return `This action updates a #${id} parent`;
  }

  remove(id: number) {
    return `This action removes a #${id} parent`;
  }
}
