import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Gender } from 'src/students/entities/gender.entity';
import { Parents } from 'src/students/entities/parents.entity';
import { Religion } from 'src/students/entities/religion.entity';
import { Students } from 'src/students/entities/student.entity';
import { Degree } from 'src/teachers/entities/degree.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Roles } from 'src/users/entities/roles.entity';
import { Users } from 'src/users/entities/users.entity';

import { Connection } from 'typeorm';
export async function DBRead(table: string, properties: string[], parameter: string, orderBy: string) {
    const selectClause = properties.map(property => `\`${property}\``).join(', ');
    const query = `SELECT ${selectClause} FROM ${table} ${parameter} ORDER BY ${orderBy};`;
    return this.ConnectionsService.execute();
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
            entities: [Users, Students, Parents, Teachers, Roles, Degree, Religion, Gender],
            autoLoadEntities: true,
            synchronize: true,
        };
        return dbConfig;
    }
}