import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Class, Classrooms, Subjects } from 'src/classrooms/entities/classrooms.entity';
import { Enrolments } from 'src/enrolment/entities/enrolments.entity';
import { Schedules } from 'src/schedules/entities/schedules.entity';
import { Genders } from 'src/students/entities/genders.entity';
import { Parents } from 'src/students/entities/parents.entity';
import { Religions } from 'src/students/entities/religions.entity';
import { Students } from 'src/students/entities/student.entity';
import { Degrees } from 'src/teachers/entities/degrees.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Roles } from 'src/users/entities/roles.entity';
import { Users } from 'src/users/entities/users.entity';
export async function DBRead(table: string, properties: string[], parameter: string, orderBy: string) {
}

@Injectable()
export class ConnectionsService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        const dbConfig: TypeOrmModuleOptions = {
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'toor',
            database: 'db_spada',
            entities: [Users, Students, Parents, Teachers, Roles, Degrees, Religions, Genders, Class, Classrooms, Subjects, Schedules, Enrolments],
            autoLoadEntities: true,
            synchronize: true,
        };
        return dbConfig;
    }
}