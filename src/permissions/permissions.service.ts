import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Pagination } from '@app/helper';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) { }
  private readonly logger = new Logger(PermissionsService.name);

  /**
     * Create a new permission.
     *
     * @param createPermissionDto - Data to create a new permission.
     * @returns The created permission.
     * @throws ConflictException if there's an error while creating the permission.
     */
  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const permission = await this.permissionsRepository.create(createPermissionDto);
      return await this.permissionsRepository.save(permission);
    } catch (error) {
      this.logger.error(`Error saving ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }


  /**
   * Retrieve permissions based on query parameters.
   *
   * @param code - Filter by permission's full code.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of items per page (default: 10).
   * @returns An array of permissions that match the query criteria.
   * @throws ConflictException if there's an error while retrieving permissions.
   */
  async findLike(
    code: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = await this.permissionsRepository
        .createQueryBuilder('permission')
        .select([
          'permission.id',
          'permission.code',
          'permission.description',
        ])
        .where('permission.deletedAt IS NULL')
        .cache(true)

      if (code) {
        queryBuilder.andWhere('((permission.code LIKE :code) OR (permission.description LIKE :code))', { code: `%${code}%` })
      }
      // this.logger.log(queryBuilder);
      const permissionCounts = await queryBuilder.orderBy('permission.id', 'ASC').getMany();
      const total = permissionCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = permissionCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/students?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/students?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find permission :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Update an existing permission.
   *
   * @param id - ID of the permission to update.
   * @param updatePermissionDto - Updated permission data.
   * @returns The updated permission.
   * @throws ConflictException if the permission doesn't exist or there's an error during update.
   */
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionsRepository.findOneBy({ id });
      if (!permission) {
        const data = {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `permission with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(permission, updatePermissionDto);
      return this.permissionsRepository.save(permission);
    } catch (error) {
      this.logger.error(`Error find permission :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Soft-delete a permission.
   *
   * @param id - ID of the permission to delete.
   * @returns The soft-deleted permission.
   * @throws ConflictException if the permission doesn't exist or there's an error during deletion.
   */
  async remove(id: number) {
    try {
      const permission = await this.permissionsRepository.findOneBy({ id });
      if (!permission) {
        const data = {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: `permission with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      // Instead of a hard delete, mark the permission as deleted (soft delete)
      permission.deletedAt = new Date();; // Assuming there's a property called "deleted" on the permission entity
      return await this.permissionsRepository.save(permission); // Save to persist the soft delete
    } catch (error) {
      this.logger.error(`Error find permission :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Restore a previously soft-deleted permission.
   *
   * @param id - ID of the permission to restore.
   * @returns The restored permission or null if not found.
   * @throws ConflictException if there's an error during restoration.
   */
  async restore(id: number): Promise<Permission> {
    try {
      const userToRestore = await this.permissionsRepository
        .createQueryBuilder('user')
        .withDeleted() // Include soft-deleted entities
        .where('user.id = :id', { id })
        .cache(true)
        .getOne();

      if (userToRestore) {
        userToRestore.deletedAt = null; // Set deletedAt back to null
        return this.permissionsRepository.save(userToRestore);
      }
      return null; // User not found
    } catch (error) {
      this.logger.error(`Error find permission :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
