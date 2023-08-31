import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { responseJson } from '@app/response';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  private _page = parseInt(process.env.PAGINATION_PAGE)
  private _limit = parseInt(process.env.PAGINATION_LIMIT)
  /**
   * Create a new permission.
   *
   * @param createPermissionDto - Data to create a new permission.
   * @param response - HTTP response object.
   */
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Create New Permission',
      data: {}
    };
    const permission = await this.permissionsService.create(createPermissionDto);
    data.data = permission;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Retrieve all permissions with optional filtering and pagination.
   *
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @param code - Filter by permission's code.
   * @param response - HTTP response object.
   */
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('code') code: string,
    @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Get Permissions',
      data: {}
    };
    page = (page == undefined) ? this._page : page;
    limit = (limit == undefined) ? this._limit : (limit > this._limit) ? this._limit : limit;
    const permissions = await this.permissionsService.findLike(code, page, limit);
    data.data = permissions;
    responseJson(data, data.statusCode, response);
  }


  /**
  * Update an existing permission.
  *
  * @param id - ID of the permission to update.
  * @param updatepermissionDto - Updated permission data.
  * @param response - HTTP response object.
  */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatepermissionDto: UpdatePermissionDto, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.ACCEPTED,
      message: 'Success Update Permission',
      data: {}
    };
    const permission = await this.permissionsService.update(+id, updatepermissionDto);
    data.data = permission;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Soft-delete a permission.
   *
   * @param id - ID of the permission to delete.
   * @param response - HTTP response object.
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Delete Permission',
      data: {}
    };
    const permission = await this.permissionsService.remove(+id);
    data.data = permission;
    responseJson(data, data.statusCode, response);
  }

  /**
   * Restore a previously soft-deleted permission.
   *
   * @param id - ID of the permission to restore.
   * @param response - HTTP response object.
   */
  @Patch(':id/restore')
  async restore(@Param('id') id: number, @Res() response) {
    const restoredUser = await this.permissionsService.restore(id);
    const data = {
      status: true,
      statusCode: HttpStatus.OK,
      message: 'Success Restore Permission',
      data: {}
    };
    data.data = restoredUser;
    responseJson(data, data.statusCode, response);
  }
}
