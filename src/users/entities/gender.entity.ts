import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Entity({ name: 'genders' })
export class Gender {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    gender!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teacher, teacher => teacher.gender_id)
    teachers: Teacher[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Student, students => students.gender)
    students: Student[];
}