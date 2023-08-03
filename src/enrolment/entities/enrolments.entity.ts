import { Class, Classrooms, Subjects } from "src/classrooms/entities/classrooms.entity";
import { Students } from "src/students/entities/student.entity";
import { Teachers } from "src/teachers/entities/teachers.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enrolments {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    enrol_code: string

    @ManyToOne(() => Students, student => student.id)
    @JoinColumn({ name: 'student_id' })
    student: Students;

    @Column()
    student_id: number;

    @ManyToOne(() => Class, classes => classes.id)
    @JoinColumn({ name: 'class_id' })
    classes: Class;

    @Column()
    class_id: number;

    @Column({ type: 'timestamp' })
    enrolment_date: Date;

    @Column({ type: 'boolean' })
    enrolment_status: boolean;
}
