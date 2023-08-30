import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Class, Classroom } from 'src/classrooms/entities/classroom.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Schedule } from 'src/schedules/entities/schedule.entity';
import { Gender } from 'src/users/entities/gender.entity';
import { Parent } from 'src/parents/entities/parent.entity';
import { Religion } from 'src/users/entities/religion.entity';
import { Student } from 'src/students/entities/student.entity';
import { Degree } from 'src/teachers/entities/degree.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { MetadataSchedule } from 'src/schedules/entities/metadata-schedule.entity';
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
            entities: [User, Student, Parent, Teacher, Role, Degree, Religion, Gender, Class, Classroom, Subject, Schedule, MetadataSchedule, Enrolment],
            autoLoadEntities: true,
            synchronize: true,
        };
        return dbConfig;
    }
}