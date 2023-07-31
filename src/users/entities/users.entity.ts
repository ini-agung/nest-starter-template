import { Length } from '@nestjs/class-validator';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToOne, JoinColumn, Relation } from 'typeorm';
import { Roles, RoleList } from './roles.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => Roles, (Roles) => Roles.id)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Roles;

  @Column({ default: RoleList.Students })
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

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}

