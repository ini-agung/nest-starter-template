import { Class } from "src/classrooms/entities/classroom.entity";
import { Schedule } from "src/schedules/entities/schedule.entity";
import { Student } from "src/students/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'enrolments' })
export class Enrolment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    enrol_code: string

    @ManyToOne(() => Student, student => student.enrolments)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column()
    student_id: number;

    @ManyToOne(() => Schedule, schedule => schedule.id)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Class;

    @Column()
    schedule_id: number;

    @Column({ type: 'timestamp' })
    enrolment_date: Date;

    @Column({ type: 'boolean' })
    enrolment_status: boolean;
}
