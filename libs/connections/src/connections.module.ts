import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
