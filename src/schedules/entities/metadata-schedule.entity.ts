import { Class } from "src/class/entities/class.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity({ name: 'metadata-schedule' })
export class MetadataSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Schedule, schedule => schedule.id)
    @JoinColumn({ name: 'enrolment_id' }) // Specify the foreign key column
    schedule: Schedule;

    @Column()
    schedule_id: number;

    @Column({ type: 'text' })
    matery: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    first_file: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    second_file: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    third_file: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ex_source: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}



