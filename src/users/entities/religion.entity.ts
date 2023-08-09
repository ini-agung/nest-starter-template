import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Parent } from 'src/parents/entities/parent.entity';

@Entity({ name: 'religions' })
export class Religion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    religion!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teacher, teacher => teacher.religion)
    teachers: Teacher[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Student, students => students.religion)
    students: Student[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Parent, parents => parents.religion_father)
    father: Parent[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Parent, parents => parents.religion_mother)
    mother: Parent[];
}