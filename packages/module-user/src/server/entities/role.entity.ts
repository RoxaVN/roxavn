import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  scope: string;

  @Column()
  name: string;

  @Column('text', { array: true })
  permissions: string[];

  @Column()
  isPredefined: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => UserRole, (role) => role.owner)
  owners: UserRole[];
}
