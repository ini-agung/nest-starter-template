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
import { ConfigModule } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';
import { ClassModule } from './class/class.module';
import { RolesModule } from './roles/roles.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConnectionsModule, UsersModule,
    AuthModule, JwtLibsModule, AuthModule,
    StudentsModule, ClassroomsModule,
    SeederModule, SchedulesModule,
    EnrolmentModule, ParentsModule,
    TeachersModule,
    PermissionsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available throughout the app
    }),
    SubjectsModule,
    ClassModule,
    RolesModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtLibsGuard,
    }
  ],
})
export class AppModule { }
