import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Students } from 'src/students/entities/student.entity';
import { Parents } from 'src/students/entities/parents.entity';
import { ParentsStudent } from 'src/students/entities/parents-students.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Roles } from 'src/users/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Change this to your database type (e.g., mysql, sqlite, etc.)
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_spada',
      entities: [Users, Students, Parents, Teachers, Roles], // Add your entity classes here.
      autoLoadEntities: true,
      synchronize: true, // Set to true for development only.
    }),
  ],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
