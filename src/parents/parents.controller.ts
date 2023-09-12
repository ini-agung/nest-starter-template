import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query, Req } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentsDto } from './dto/create-parents.dto';
import { UpdateParentsDto } from './dto/update-parents.dto';
import { responseJson } from '@app/response';
import { Response, Request } from 'express';

@Controller('parents')
export class ParentsController {

  constructor(private readonly parentsService: ParentsService) { }
  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  /**
     * Create a new parent.
     *
     * @param createParentDto - Data to create a new parent.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     */
  @Post()
  async create(
    @Body() createParentDto: CreateParentsDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
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

  /**
   * Retrieve all parents with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param name - Filter by parent's name.
   * @param phone - Filter by parent's phone.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Parents',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const parents = await this.parentsService.findLike(phone, name, page, limit);
    data.data = parents;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve a single parent by ID.
   *
   * @param id - ID of the parent to retrieve.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
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

  /**
     * Update an existing parent.
     *
     * @param id - ID of the parent to update.
     * @param updateParentDto - Updated parent data.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentsDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
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

  /**
   * Delete a parent (soft delete).
   *
   * @param id - ID of the parent to delete.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
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

  /**
  * Restore a previously soft-deleted parent.
  *
  * @param id - ID of the parent to restore.
  * @param response - HTTP response object.
  */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const restoredParent = await this.parentsService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Parent',
      data: {}
    };
    if (restoredParent == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Parent with id ${id} not found`;
    } else {
      data.data = restoredParent;
    }
    responseJson(data, data.statusCode, response);
  }
}
