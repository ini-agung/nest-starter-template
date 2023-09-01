import { ConflictException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Pagination, captureSentryException } from '@app/helper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,) { }
  private readonly logger = new Logger(RolesService.name);

  /**
     * Create a new role.
     *
     * @param createRoleDto - The data to create a new role.
     * @returns The created role data.
     */
  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.rolesRepository.create(createRoleDto);
      return await this.rolesRepository.save(role);
    } catch (error) {
      this.logger.error(`Error saving ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
  * Retrieve students based on filters with optional pagination.
  *
  * @param phone - Filter by phone of father or mother.
  * @param name - Filter by name of father or mother.
  * @param page - Page number for pagination.
  * @param limit - Number of items per page.
  * @returns Paginated list of filtered students.
  */
  async findLike(
    role: string,
    page: number,
    limit: number,
  ): Promise<Pagination<any>> {
    try {
      const queryBuilder = this.rolesRepository
        .createQueryBuilder('role')
        .select([
          'role.id', 'role.role'
        ])
        .where('role.deletedAt IS NULL')
      if (role) {
        queryBuilder.andWhere('role.role LIKE :role', { role: `%${role}%` });
      }
      const studentsCounts = await queryBuilder.getMany();
      this.logger.log(studentsCounts);
      const total = studentsCounts.length;
      const startIdx = (page - 1) * limit;
      const endIdx = parseInt(startIdx.toString()) + parseInt(limit.toString());
      const data = studentsCounts.slice(startIdx, endIdx);
      return {
        data,
        total,
        currentPage: page,
        perPage: limit,
        prevPage: page > 1 ? `/roles?page=${(parseInt(page.toString()) - 1)}` : undefined,
        nextPage: endIdx < total ? `/roles?page=${(parseInt(page.toString()) + 1)}` : undefined,
      };
    } catch (error) {
      this.logger.error(`Error find student :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      captureSentryException(error);
      data.data = error.message;
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
     * Retrieve role based on filters with param.
     *
     * @param id - Id role.
     * @returns Paginated list of filtered role.
     */
  async findOne(id: number): Promise<Role> {
    try {
      return await this.rolesRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(`Error find role :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
    * Update an existing role.
    *
    * @param id - ID of the role to update.
    * @param updateRoleDto - Updated role data.
    * @returns Updated role data.
    */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.rolesRepository.findOneBy({ id });
      if (!role) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `role with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      Object.assign(role, updateRoleDto);
      return this.rolesRepository.save(role);
    } catch (error) {
      this.logger.error(`Error find role :  ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
   * Delete a teacher (soft delete).
   *
   * @param id - ID of the teacher to delete.
   * @returns Deleted teacher data.
   */
  async remove(id: number) {
    try {
      const role = await this.rolesRepository.findOneBy({ id });
      if (!role) {
        const data = {
          status: false,
          statusCode: HttpStatus.CONFLICT,
          message: `role with id ${id} is doesnt exists`,
          data: {}
        };
        throw new ConflictException(data, { cause: new Error() });
      }
      role.deletedAt = new Date();
      return await this.rolesRepository.save(role);
    } catch (error) {
      this.logger.error(`Error find role :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }

  /**
 * Restore a previously soft-deleted role.
 *
 * @param id - ID of the role to restore.
 * @returns Restored role data.
 */
  async restore(id: number): Promise<Role> {
    try {
      const roleToRestore = await this.rolesRepository
        .createQueryBuilder('role')
        .withDeleted() // Include soft-deleted entities
        .where('role.id = :id', { id })
        .getOne();
      if (roleToRestore) {
        roleToRestore.deletedAt = null; // Set deletedAt back to null
        return await this.rolesRepository.save(roleToRestore);
      }
      return null; // role not found
    } catch (error) {
      this.logger.error(`Error find role :   ${error.message}`);
      const data = {
        status: false,
        statusCode: HttpStatus.CONFLICT,
        message: error.sqlMessage,
        data: {}
      };
      data.data = error.message;
      captureSentryException(error);
      throw new ConflictException(data, { cause: new Error() });
    }
  }
}
