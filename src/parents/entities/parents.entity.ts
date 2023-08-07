import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Students } from '../../students/entities/student.entity';
import { Religions } from '../../users/entities/religions.entity';

@Entity()
export class Parents {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Students, (students) => students.id)
    @JoinColumn({ name: 'student_id' })
    student: Students[]

    @Column({ type: 'bigint', unique: true })
    user_id: number;

    @Column({ type: 'varchar', length: 100 })
    father: string;

    @Column({ type: 'varchar', length: 100 })
    mother: string;

    @Column({ type: 'varchar', length: 15 })
    phone_father: string

    @Column({ type: 'varchar', length: 15 })
    phone_mother: string

    @Column({ type: 'varchar', length: 50, default: 'img-female.jpg' })
    img_mother: string;

    @Column({ type: 'varchar', length: 50, default: 'img-male.jpg' })
    img_father: string;

    @ManyToOne(() => Religions, religion => religion.students)
    @JoinColumn({ name: 'religion_father' })
    rf: Religions;

    @Column()
    religion_father: number;

    @ManyToOne(() => Religions, religion => religion.students)
    @JoinColumn({ name: 'religion_mother' })
    rm: Religions;

    @Column()
    religion_mother: number;


    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

}