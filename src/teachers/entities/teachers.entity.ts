import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

enum Gender{
    Male,
    Female,
    Other,
}

enum Religion{
    Budha,
    Hindu,
    Islam,
    Katolik,
    Konghucu,
    Protestan,
    Other,
}

enum Degree{
    HighSchool,
    Bachelor,
    Masters,
    Doctor,
    Other,
}

@Entity()
export class Teachers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int', unique: true})
    nik: number;

    @Column({type: 'text'})
    degree: Degree;

    @Column({type: 'varchar', length: 100})
    full_name: string;
    
    @Column({type: 'varchar', length: 50})
    nick_name: string; 
    
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
    
    @Column({type:'date'})
    entry_year: Date;

    @Column({type:'varchar', length: 150})
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
