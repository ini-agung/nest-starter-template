import { Subject } from "src/subjects/entities/subject.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'classrooms' })
export class Classroom {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ unique: true })
    classroom: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}

