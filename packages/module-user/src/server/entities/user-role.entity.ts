import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity.js';
import { User } from './user.entity.js';

@Entity()
export class UserRole {
  @PrimaryColumn('character varying', { default: '' })
  scopeId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: Relation<User>;

  // cache scope value for better query
  @Column('character varying')
  scope: string;

  @PrimaryColumn('integer')
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  role: Relation<Role>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
