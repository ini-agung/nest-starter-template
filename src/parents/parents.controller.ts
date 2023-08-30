import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { responseJson } from '@app/response';
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }
  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  @Post()
  async create(@Body() createParentDto: CreateParentsDto, @Res() response) {
    const parent = await this.parentsService.create(createParentDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Parent',
      data: {}
    };
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parents',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    console.log("limit", limit)
    const parents = await this.parentsService.findLike(phone, name, page, limit);
    data.data = parents;
    responseJson(data, data.statusCode, response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parent',
      data: {}
    };
    const parent = await this.parentsService.findOne(+id);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateParentDto: UpdateParentsDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Parent',
      data: {}
    };
    const parent = await this.parentsService.update(+id, updateParentDto);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Parent',
      data: {}
    };
    const parent = await this.parentsService.remove(+id);
    data.data = parent;
    responseJson(data, data.statusCode, response);
  }
}
