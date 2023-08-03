import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Students } from './student.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';

@Entity()
export class Gender {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    gender!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teachers, teacher => teacher.gender_id)
    teachers: Teachers[];

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Students, students => students.gender)
    students: Students[];
}