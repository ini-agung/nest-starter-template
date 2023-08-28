import { Role } from "src/users/entities/role.entity";
import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;


    @Column({ type: 'varchar', length: 10, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
    rolePermissions: RolePermission[];

    @ManyToMany(() => User, user => user.id)
    userPermissions: User[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
    deletedAt: Date | null;
}


@Entity({ name: 'role_permissions' })
export class RolePermission {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => Role, role => role.rolePermissions)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column()
    role_id: number;

    @ManyToOne(() => Permission, permission => permission.rolePermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @Column()
    permission_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
    deletedAt: Date | null;
}

@Entity({ name: 'user_permission' })
export class UserPermission {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;

    @ManyToOne(() => Permission, permission => permission.userPermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    @Column()
    permission_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, default: null })
    deletedAt: Date | null;
}
