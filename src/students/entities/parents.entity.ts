import { OneToMany, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, JoinColumn } from 'typeorm';
import { Students } from './student.entity';

@Entity()
export class Parents {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToMany(()=>Students, (students) => students.id)
    @JoinColumn({name: 'student_id'})
    student: Students[]

    @Column({type: 'bigint', unique:true})
    user_id: number;

    @Column({type: 'varchar', length:150})
    father: string;    
    
    @Column({type: 'varchar', length:150})
    mother: string;
    
    @Column({type: 'varchar', length: 15})
    phone_father: string

    @Column({type: 'varchar', length: 15})
    phone_mother: string
    
    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_mother: string;
    
    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_father: string;
    
    @Column({type: 'varchar', length: 15})
    religion_father: string; 

    @Column({type: 'varchar', length: 15})
    religion_mother: string; 

    @Column({type: 'varchar', length: 200})
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

}