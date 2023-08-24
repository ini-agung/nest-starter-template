import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Religion } from '../../users/entities/religion.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'parents' })
export class Parent {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Student, (students) => students.id)
    @JoinColumn({ name: 'student_id' })
    student: Student[]

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @Column()
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

    @ManyToOne(() => Religion, religion => religion.father)
    @JoinColumn({ name: 'religion_father' })
    rf: Religion;

    @Column()
    religion_father: number;

    @ManyToOne(() => Religion, religion => religion.mother)
    @JoinColumn({ name: 'religion_mother' })
    rm: Religion;

    @Column()
    religion_mother: number;


    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

}