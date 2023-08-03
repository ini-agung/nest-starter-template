import { Class, Classrooms, Subjects } from "src/classrooms/entities/classrooms.entity";
import { Students } from "src/students/entities/student.entity";
import { Teachers } from "src/teachers/entities/teachers.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enrolment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    // Many-to-many relationships with Student, Teacher, Subject, Class, and RoomClass
    @ManyToMany(() => Students, (student) => student.enrolments)
    @JoinTable()
    students: Students[];

    @ManyToMany(() => Teachers, (teacher) => teacher.enrolments)
    @JoinTable()
    teachers: Teachers[];

    @ManyToMany(() => Subjects, (subject) => subject.enrolments)
    @JoinTable()
    subjects: Subjects[];

    @ManyToMany(() => Class, (classEntity) => classEntity.enrolments)
    @JoinTable()
    classes: Class[];

    @ManyToMany(() => Classrooms, (roomClass) => roomClass.enrolments)
    @JoinTable()
    classroom: Classrooms[];

    @Column({ type: 'date' })
    enrolment_date: Date;

    @Column({ type: 'varchar', length: 20 })
    enrolment_status: string;
}
