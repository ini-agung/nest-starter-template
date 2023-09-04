import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query, Req } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { responseJson } from '@app/response';
import { Response } from 'express';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  private _version = (process.env.VERSION.toLowerCase() == 'v2') ? true : false;

  /**
   * Create a new classes.
   *
   * @param createClassDto - Data to create a new classes.
   * 
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   * @returns Created classes data.
   */
  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.classService.create(createClassDto);
    const classes = await this.classService.create(createClassDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New classes',
      data: {}
    };
    data.data = classes;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Get a list of all classess.
   *
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   * @returns List of classess.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('id') id: number,
    @Query('classes') classes: string,
    @Res() response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get classess',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const classess = await this.classService.findLike(id, classes, page, limit);
    data.data = classess;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Update a classes's details.
     *
     * @param id - ID of the classes to update.
     * @param updateClassDto - Data to update the classes.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     * @returns Updated classes data.
     */
  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update classes',
      data: {}
    };
    const classes = await this.classService.update(+id, updateClassDto);
    data.data = classes;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Delete a classes.
     *
     * @param id - ID of the classes to delete.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     * @returns Deleted classes data.
     */
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete classes',
      data: {}
    };
    const classes = await this.classService.remove(+id);
    data.data = classes;
    responseJson(data, data.statusCode, response);
  }

  /**
    * Restore a previously soft-deleted classes.
    *
    * @param id - ID of the classes to restore.
    * @param request - HTTP request object.
    * @param response - HTTP response object.
    */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const restoredClass = await this.classService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore classes',
      data: {}
    };
    if (restoredClass == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Class with id ${id} not found`;
    } else {
      data.data = restoredClass;
    }
    responseJson(data, data.statusCode, response);
  }
}
