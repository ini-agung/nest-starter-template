import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity({ name: 'degrees' })
export class Degree {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: '20', unique: true })
    degree!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teacher, teacher => teacher.degree)
    teachers: Teacher[];
}
