import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { responseJson } from '@app/response';

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
   * @returns Created classes data.
   */
  @Post()
  async create(@Body() createClassDto: CreateClassDto,
    @Res() response,
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
    let classess: object;
    if (id || classes) {
      classess = await this.classService.findLike(id, classes, page, limit);
    } else {
      classess = await this.classService.findAll(page, limit);
    }
    data.data = classess;
    responseJson(data, data.statusCode, response);
    return await this.classService.findAll();
  }

  /**
     * Update a classes's details.
     *
     * @param id - ID of the classes to update.
     * @param updateClassDto - Data to update the classes.
     * @returns Updated classes data.
     */
  @Patch(':id')
  async update(@Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Res() response,
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
     * @returns Deleted classes data.
     */
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Res() response,
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
    * @param response - HTTP response object.
    */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredUser = await this.classService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore classes',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
