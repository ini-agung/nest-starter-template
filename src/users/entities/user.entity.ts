import { Length } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, Relation, ManyToOne, Index } from 'typeorm';
import { Role } from './role.entity';
import { Student } from 'src/students/entities/student.entity';
import { Parent } from 'src/parents/entities/parent.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Role, role => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ default: 1 })
  role_id: number;

  @Length(6, 255)
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;
}

