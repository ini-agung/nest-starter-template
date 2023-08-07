import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Degrees } from './degrees.entity';
import { Users } from 'src/users/entities/users.entity';
import { Religions } from 'src/students/entities/religions.entity';
import { Genders } from 'src/students/entities/genders.entity';


@Entity()
export class Teachers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', unique: true })
    nik: number;

    @OneToOne(() => Users, (Users) => Users.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: Users;

    @Column()
    user_id: number;

    // Define the many-to-one relationship with the Degree entity
    @ManyToOne(() => Degrees, degree => degree.teachers)
    @JoinColumn({ name: 'degree_id' })
    degree: Degrees;

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
    @ManyToOne(() => Genders, gender => gender.id)
    @JoinColumn({ name: 'gender_id' })
    gender: Genders;

    @Column()
    gender_id: number;

    // Define the many-to-one relationship with the Degree entity
    @ManyToOne(() => Religions, religion => religion.id)
    @JoinColumn({ name: 'religion_id' })
    religion: Religions;

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
