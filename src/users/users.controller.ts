import { Res, Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseJson } from '@app/response';
import { ParentsService } from 'src/parents/parents.service';
import { Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly parentService: ParentsService
  ) { }
  private _page = parseInt(process.env.PAGINATION_PAGE);
  private _limit = parseInt(process.env.PAGINATION_LIMIT);
  private _version = (process.env.VERSION.toLowerCase() == 'v2') ? true : false;

  /**
     * Create a new user.
     *
     * @param createUserDto - Data to create a new user.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     */
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const newUser = await this.usersService.create(createUserDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Users',
      data: {}
    };
    data.data = newUser;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve all permissions with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param user - Filter by permission's user.
   * @param permission - Filter by permission's permission.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */

  @Get('/permission')
  async permission(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('user') user: string,
    @Query('permission') permission: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users Permission',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    let users: object;
    users = await this.usersService.findUserPermission(page, limit, user, permission);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  @Get('test')
  async test(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('username') username: string,
    @Query('email') email: string,
  ) {
    const user = await this.usersService.findAll(username, email, page, limit);
    const parent = await this.parentService.findLike(username, email, page, limit,);
    return [user, parent]
  }

  /**
   * Retrieve all users with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param username - Filter by user's username.
   * @param email - Filter by user's email.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('username') username: string,
    @Query('email') email: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const users = await this.usersService.findAll(username, email, page, limit);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  /**
    * Get details of a specific user by identity (username or email).
    *
    * @param identity - Username or email of the user.
    * @param request - HTTP request object.
    * @param response - HTTP response object.
    * @returns User details.
    */
  @Get(':identity')
  async findOne(
    @Param('identity') identity: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users',
      data: {}
    };
    const users = await this.usersService.findOne(identity);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Update a user's details.
   *
   * @param id - ID of the user to update.
   * @param updateUserDto - Data to update the user.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   * @returns Updated user data.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Student',
      data: {}
    };
    const users = await this.usersService.update(+id, updateUserDto);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Delete a user.
     *
     * @param id - ID of the user to delete.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     * @returns Deleted user data.
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
      message: 'Success Delete Users',
      data: {}
    };

    const users = await this.usersService.remove(+id);
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  /**
  * Restore a previously soft-deleted user.
  *
  * @param id - ID of the user to restore.
  *  @param request - HTTP request object.
  * @param response - HTTP response object.
  * @param response - HTTP response object.
  */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Res() response,
  ) {
    const restoredUser = await this.usersService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore User',
      data: {}
    };
    if (restoredUser == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `User with id ${id} not found`;
    } else {
      data.data = restoredUser;
    }
    responseJson(data, data.statusCode, response);
  }




}
