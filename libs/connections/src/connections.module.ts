import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Change this to your database type (e.g., mysql, sqlite, etc.)
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_spada',
      entities: [], // Add your entity classes here.
      autoLoadEntities: true,
      synchronize: true, // Set to true for development only.
    }),
  ],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
