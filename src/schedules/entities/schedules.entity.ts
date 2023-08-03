import { Class } from "src/classrooms/entities/classrooms.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Schedules {
    @PrimaryGeneratedColumn()
    schedule_id: number;

    @Column({ type: 'varchar', length: 15 })
    day_of_week: string;

    @Column({ type: 'time' })
    time_start: string;

    @Column({ type: 'time' })
    time_finish: string;

    @ManyToOne(() => Class, classes => classes.id)
    @JoinColumn({ name: 'classes_id' })
    classes: Class;

    @Column()
    class_id: number;
}