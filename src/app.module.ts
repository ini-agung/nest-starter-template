import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from '@app/connections';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtLibsModule } from '@app/jwt-libs';
import { APP_GUARD } from '@nestjs/core';
import { JwtLibsGuard } from '@app/jwt-libs/jwt-libs.guard';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { SeederModule } from '@app/seeder';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [ConnectionsModule, UsersModule, AuthModule, JwtLibsModule, AuthModule, StudentsModule, TeachersModule, ClassroomsModule, SeederModule, SchedulesModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtLibsGuard,
    },
  ],
})
export class AppModule { }
