import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

enum Religion{
    Budha,
    Hindu,
    Islam,
    Katolik,
    Konghucu,
    Protestan,
}

@Entity()
export class Parents {
    @PrimaryGeneratedColumn()
    id: number;
    
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
    
    @Column({type: 'text'})
    religion_father: Religion; 

    @Column({type: 'text'})
    religion_mother: Religion; 

    @Column({type: 'varchar', length: 150})
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

}