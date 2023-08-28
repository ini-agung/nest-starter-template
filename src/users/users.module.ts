import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { RolePermission, UserPermission } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Parent, Teacher, RolePermission, UserPermission])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
