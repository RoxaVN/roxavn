import {
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

  @PrimaryColumn()
  ownerId: number;

  @ManyToOne(() => User, (owner) => owner.roles)
  owner: User;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => Role, (role) => role.owners)
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
