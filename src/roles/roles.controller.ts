import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { responseJson } from '@app/response';
import { decryptData, encryptData } from '@app/helper';
import { Response, Request } from 'express';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE);
  private _limit = parseInt(process.env.PAGINATION_LIMIT);

  /**
     * Create a new role.
     *
     * @param createroleDto - Data to create a new role.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     */
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Request,
    @Res() response: Response) {
    const role = await this.rolesService.create(createRoleDto);
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New role',
      data: {}
    };
    data.data = role;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve all roles with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param role - Filter by role's role.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number = this._page,
    @Query('limit') limit: number = this._limit,
    @Query('role') role: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Roles',
      data: {}
    };

    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const roles = await this.rolesService.findLike(role, page, limit);
    data.data = roles;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve a single role by ID.
   *
   * @param id - ID of the role to retrieve.
   * @param request - HTTP request object.
   * @param response - HTTP response object.
   */
  @Get(':id')
  async findOne(@Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Role',
      data: {}
    };
    const role = await this.rolesService.findOne(+id);
    data.data = role;
    responseJson(data, data.statusCode, response);
  }

  /**
     * Update an existing role.
     *
     * @param id - ID of the role to update.
     * @param updateRoleDto - Updated role data.
     * @param request - HTTP request object.
     * @param response - HTTP response object.
     */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Update Role',
      data: {}
    };
    const role = await this.rolesService.update(+id, updateRoleDto);
    data.data = role;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Delete a role (soft delete).
   *
   * @param id - ID of the role to delete.
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
      message: 'Success Delete Role',
      data: {}
    };
    const role = await this.rolesService.remove(+id);
    data.data = role;
    responseJson(data, data.statusCode, response);
  }

  /**
  * Restore a previously soft-deleted role.
  *
  * @param id - ID of the role to restore.
  * @param request - HTTP request object.
  * @param response - HTTP response object.
  */
  @Patch(':id/restore')
  async restore(
    @Param('id') id: number,
    @Req() request: Request,
    @Res() response,
  ) {
    const restoredrole = await this.rolesService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Role',
      data: {}
    };
    if (restoredrole == null) {
      data.statusCode = HttpStatus.BAD_REQUEST;
      data.message = `Role with id ${id} not found`;
    } else {
      data.data = restoredrole;
    }
    responseJson(data, data.statusCode, response);
  }
}
