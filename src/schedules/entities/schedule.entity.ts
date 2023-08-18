import { Class } from "src/classrooms/entities/classroom.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'schedules' })
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 10, unique: true })
    schedule_code: string;

    @Column({ type: 'varchar', length: 15 })
    day_of_week: string;

    @Column({ type: 'time' })
    time_start: string;

    @Column({ type: 'time' })
    time_finish: string;

    @ManyToOne(() => Class, classes => classes.id)
    @JoinColumn({ name: 'class_id' })
    @Column()
    class_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}