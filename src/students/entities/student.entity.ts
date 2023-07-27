import { ManyToOne, Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';


@Entity()
export class Students {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'bigint', unique: true})
    id_user:number;

    @Column({type: 'int', unique: true, nullable: true})
    nis: number | null;

    @Column({type: 'varchar', length: 100, nullable: true})
    full_name: string | null;
    
    @Column({type: 'varchar', length: 50, nullable: true})
    nick_name: string | null; 
    
    @Column({type: 'date', nullable: true})
    date_birth: Date | null;
    
    @Column({type: 'varchar', length: 100, nullable: true})
    place_birth: string | null;

    @Column({type: 'char', length:10})
    gender: String | null;

    @Column({type: 'char', length: 15})
    religion: String | null;

    @Column({type: 'varchar', length: 15})
    phone: string | null;
    
    @Column({type: 'int', nullable: true })
    siblings: number | null;
    
    @Column({type:'int', nullable: true})
    child_order: number | null;
    
    @Column({type:'date', nullable: true})
    entry_year: Date | null;

    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_mother: string | null;

    @Column({type:'varchar', length: 150, default: 'default.jpg'})
    img_father: string | null;

    @Column({type:'varchar', length: 150, nullable: true})
    address: string | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}