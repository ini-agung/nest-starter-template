import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation } from 'typeorm';
import { Users } from './users.entity';

export enum RoleList {
  Students = 1,
  Teachers = 2,
  Staff = 3,
  Parents = 4,
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  role: string;

  @OneToOne(() => Users, (users) => users.role)
  user: Relation<Users>
}

