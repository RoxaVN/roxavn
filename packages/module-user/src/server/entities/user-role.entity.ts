import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity()
export class UserRole {
  @PrimaryColumn('character varying', { default: '' })
  scopeId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  // cache scope value for better query
  @Column('character varying')
  scope: string;

  @PrimaryColumn('integer')
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
