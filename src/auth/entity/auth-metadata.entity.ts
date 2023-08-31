import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'auth-metadata' })
export class AuthMetadata {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => User, user => user.id) // Establishing the relationship
    @JoinColumn({ name: 'user_id' }) // Column name for the foreign key
    user: User; // Reference to the User entity

    @Column()
    user_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    login_timestamp: Date;

    @Column({ type: 'timestamp', nullable: true })
    logout_timestamp: Date;

    @Column()
    ip_address: string;

    @Column()
    user_agent: string;

    @Column()
    device_information: string;
}