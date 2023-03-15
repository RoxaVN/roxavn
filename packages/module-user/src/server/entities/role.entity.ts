import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
@Unique(['scope', 'name'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scope: string;

  @Column()
  name: string;

  @Column()
  module: string;

  @Column('text', { array: true })
  permissions: string[];

  @Column()
  hasId: boolean;

  @Column()
  isPredefined: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => UserRole, (role) => role.user)
  users: UserRole[];
}
