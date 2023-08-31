import { Subject } from "src/subjects/entities/subject.entity";
import { Classroom } from "src/classrooms/entities/classroom.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'class' })
export class Class {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20 })
    class: string;

    @ManyToOne(() => Classroom, classroom => classroom.id)
    @JoinColumn({ name: 'classroom_id' })
    classroom: Classroom;

    @Column()
    classroom_id: number;

    @ManyToOne(() => Teacher, teacher => teacher.id)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;

    @Column()
    teacher_id: number;

    @ManyToOne(() => Subject, subject => subject.id)
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column()
    subject_id: number;

    @Column({ type: 'int' })
    max_students: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}
