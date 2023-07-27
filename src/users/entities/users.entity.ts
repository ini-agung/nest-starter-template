import { Length } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'varchar', length: 100})
  fullname: string;

  @Length(6, 255)
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({type: 'varchar', length: 255})
  password: string;

  @Column({type:'varchar', length: 150, default: 'default.jpg'})
  img: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
