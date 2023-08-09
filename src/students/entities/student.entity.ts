import { ManyToOne, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Parent } from '../../parents/entities/parent.entity';
import { User } from 'src/users/entities/user.entity';
import { Religion } from '../../users/entities/religion.entity';
import { Gender } from '../../users/entities/gender.entity';


@Entity({ name: 'students' })
export class Student {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: number;

    @ManyToOne(() => Parent, (Parent) => Parent.id)
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id', })
    parent!: Parent;

    @Column()
    parent_id: number;

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

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

    @Column({ type: 'varchar', length: 255 })
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

    @Column({ type: 'varchar', length: 150, default: 'avatar.jpg' })
    img!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date | null;
}