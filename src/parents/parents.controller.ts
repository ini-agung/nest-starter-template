import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }

  @Post()
  create(@Body() createParentDto: CreateParentsDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentsDto) {
    return this.parentsService.update(+id, updateParentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentsService.remove(+id);
  }
}
