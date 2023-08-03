import { Teachers } from "src/teachers/entities/teachers.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Classrooms {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ unique: true })
    classroom: string;
}


@Entity()
export class Subjects {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 50 })
    subject: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;
}

@Entity()
export class Class {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20 })
    class: string;

    @ManyToOne(() => Classrooms, classroom => classroom.id)
    @JoinColumn({ name: 'classroom_id' })
    classroom: Classrooms;

    @Column()
    classroom_id: number;

    @ManyToOne(() => Teachers, teacher => teacher.id)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teachers;

    @Column()
    teacher_id: number;

    @ManyToOne(() => Subjects, subject => subject.id)
    @JoinColumn({ name: 'subject_id' })
    subject: Subjects;

    @Column()
    subject_id: number;

    @Column({ type: 'int' })
    max_students: number;
}
