import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Degree } from './degree.entity';
import { Users } from 'src/users/entities/users.entity';
import { Religion } from 'src/students/entities/religion.entity';
import { Gender } from 'src/students/entities/gender.entity';


@Entity()
export class Teachers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', unique: true })
    nik: number;

    // Define the many-to-one relationship with the Degree entity
    @ManyToOne(() => Degree, degree => degree.teachers)
    @JoinColumn({ name: 'degree_id' })
    degree: Degree;

    @Column()
    degree_id: number;

    @Column({ type: 'varchar', length: 100 })
    full_name: string;

    @Column({ type: 'varchar', length: 50 })
    nick_name: string;

    @Column({ type: 'date' })
    date_birth: Date;

    @Column({ type: 'varchar', length: 100 })
    place_birth: string;

    // Define the many-to-one relationship with the Degree entity
    @ManyToOne(() => Gender, gender => gender.teachers)
    @JoinColumn({ name: 'gender_id' })
    gender: Gender;

    @Column()
    gender_id: number;

    // Define the many-to-one relationship with the Degree entity
    @ManyToOne(() => Religion, religion => religion.teachers)
    @JoinColumn({ name: 'religion_id' })
    religion: Religion;

    @Column()
    religion_id: number;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'date' })
    entry_year: Date;

    @Column({ type: 'varchar', length: 150 })
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
