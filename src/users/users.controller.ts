import { Res, Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { responseJson } from '@app/response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
     * Create a new user.
     *
     * @param createUserDto - Data to create a new user.
     * @returns Created user data.
     */
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response) {
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
     * Get a list of all users.
     *
     * @returns List of users.
     */
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string,
    @Query('email') email: string,

    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Users',
      data: {}
    };
    page = (page < 1) ? 1 : page;
    limit = (limit > 10) ? 10 : limit;
    let users: object;
    if (username || email) {
      users = await this.usersService.findAll(page, limit, username, email);
    }
    data.data = users;
    responseJson(data, data.statusCode, response);
  }

  /**
    * Get details of a specific user by identity (username or email).
    *
    * @param identity - Username or email of the user.
    * @returns User details.
    */
  @Get(':identity')
  async findOne(@Param('identity') identity: string, @Res() response) {
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
   * @returns Updated user data.
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() response) {
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
     * @returns Deleted user data.
     */
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
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
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Success Restore User',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
