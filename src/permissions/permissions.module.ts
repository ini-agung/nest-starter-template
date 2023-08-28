import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, RolePermission, UserPermission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, RolePermission, UserPermission])],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule { }
