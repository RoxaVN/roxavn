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
@Unique(['resource', 'name'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resource: string;

  @Column()
  name: string;

  @Column('text', { array: true })
  permissions: string[];

  @Column()
  hasId: boolean;

  @Column()
  isPredefined: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => UserRole, (role) => role.owner)
  owners: UserRole[];
}
