import { Length } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, Relation, ManyToOne } from 'typeorm';
import { Roles } from './roles.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Roles, role => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @Column({ default: 1 })
  role_id: number;

  @Length(6, 255)
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 150, default: 'default.jpg' })
  img: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;
}

