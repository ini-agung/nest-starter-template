import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

enum Gender{
    Male,
    Female,
}

enum Religion{
    Budha,
    Hindu,
    Islam,
    Katolik,
    Konghucu,
    Protestan,
}

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'number', length:11, unique: true})
    nis: number;

    @Column({type: 'varchar', length: 100})
    full_name: string;
    
    @Column({type: 'varchar', length: 50})
    nick_name: string; 

    @Column({type: 'varchar', length: 100})
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string
    
    @Column({type: 'date'})
    date_birth: Date;
    
    @Column({type: 'varchar', length: 100})
    place_birth: string;

    @Column({type: 'text'})
    gender: Gender;

    @Column({type: 'text'})
    religion: Religion;

    @Column({type: 'varchar', length: 15})
    phone: string;
    
    @Column({type: 'number'})
    siblings: number;
    
    @Column({type:'number'})
    child_order: number;
    
    @Column({type:'date'})
    entry_year: Date;

    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_mother: string;

    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_father: string;

    @Column({type:'varchar', length: 150})
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}