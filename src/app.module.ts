import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from '@app/connections';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtLibsModule } from '@app/jwt-libs';
import { APP_GUARD } from '@nestjs/core';
import { JwtLibsGuard } from '@app/jwt-libs/jwt-libs.guard';

@Module({
  imports: [ConnectionsModule, UsersModule, AuthModule, JwtLibsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService,
      {
        provide: APP_GUARD,
        useClass: JwtLibsGuard,
      },
    ],
})
export class AppModule {}
