import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Relation, ManyToMany, JoinTable, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Permission, RolePermission } from 'src/permissions/entities/permission.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  role: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;
}

