import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtLibsService } from '@app/jwt-libs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Student } from 'src/students/entities/student.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { RolePermission, UserPermission } from 'src/permissions/entities/permission.entity';
import { MetadataDto } from './dto/metadata.dto';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Parent, Teacher, RolePermission, UserPermission, MetadataDto])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtLibsService]
})
export class AuthModule { }
