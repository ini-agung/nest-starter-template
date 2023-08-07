import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: ConnectionsService, // Use the TypeOrmConfigService here
    }),

  ],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule { }
