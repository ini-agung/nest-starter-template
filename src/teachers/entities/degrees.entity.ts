import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Teachers } from './teachers.entity';

@Entity()
export class Degrees {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: '20', unique: true })
    degree!: string;

    // Define the one-to-many relationship with the Teacher entity
    @OneToMany(() => Teachers, teacher => teacher.degree)
    teachers: Teachers[];
}
