import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class ParentsStudent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    id_parent: number;

    @Column({type: 'int', unique: true})
    id_student: number;
}