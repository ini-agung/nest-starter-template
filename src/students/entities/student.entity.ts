import { ManyToOne, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Parents } from './parents.entity';
import { Users } from 'src/users/entities/users.entity';
import { Religion } from './religion.entity';
import { Gender } from './gender.entity';


@Entity()
export class Students {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Parents, (Parents) => Parents.id)
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id', })
    parent!: Parents;

    @Column()
    parent_id: number;

    @OneToOne(() => Users, (Users) => Users.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: Users;

    @Column()
    user_id: number;

    @Column({ type: 'int', unique: true })
    nis!: number;

    @Column({ type: 'varchar', length: 100 })
    full_name!: string;

    @Column({ type: 'varchar', length: 50 })
    nick_name!: string;

    @Column({ type: 'date' })
    date_birth!: Date;

    @Column({ type: 'varchar', length: 100 })
    place_birth!: string;

    @ManyToOne(() => Gender, gender => gender.students)
    @JoinColumn({ name: 'gender_id' })
    gender: Gender;

    @Column()
    gender_id: number;

    @ManyToOne(() => Religion, religion => religion.students)
    @JoinColumn({ name: 'religion_id' })
    religion: Religion;

    @Column()
    religion_id: number;

    @Column({ type: 'varchar', length: 15 })
    phone!: string;

    @Column({ type: 'int' })
    siblings!: number;

    @Column({ type: 'int' })
    child_order!: number;

    @Column({ type: 'date' })
    entry_year!: Date;

    @Column({ type: 'varchar', length: 150 })
    address!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}