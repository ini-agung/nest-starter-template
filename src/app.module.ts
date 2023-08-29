import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from '@app/connections';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtLibsModule } from '@app/jwt-libs';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtLibsGuard } from '@app/jwt-libs/jwt-libs.guard';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { SeederModule } from '@app/seeder';
import { SchedulesModule } from './schedules/schedules.module';
import { EnrolmentModule } from './enrolment/enrolment.module';
import { ParentsModule } from './parents/parents.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SuccessRequestInterceptor } from './success-request.interceptor';

@Module({
  imports: [
    ConnectionsModule, UsersModule,
    AuthModule, JwtLibsModule, AuthModule,
    StudentsModule, ClassroomsModule,
    SeederModule, SchedulesModule,
    EnrolmentModule, ParentsModule,
    TeachersModule,
    PermissionsModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtLibsGuard,
    },
    {
      provide: APP_INTERCEPTOR, // Import APP_INTERCEPTOR from '@nestjs/core'
      useClass: SuccessRequestInterceptor,
    }
  ],
})
export class AppModule { }
