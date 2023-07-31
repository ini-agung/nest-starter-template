import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Teachers } from './teachers.entity';

@Entity()
export class Degree {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column()
    degree!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teachers, teacher => teacher.degree)
    teachers: Teachers[];
}
