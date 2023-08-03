import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Students } from './student.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';

@Entity()
export class Religion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    religion!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teachers, teacher => teacher.religion)
    teachers: Teachers[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Students, students => students.religion)
    students: Students[];
}