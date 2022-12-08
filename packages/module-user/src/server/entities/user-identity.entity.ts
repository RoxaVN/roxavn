import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class UserIdentity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (owner) => owner.identities)
  owner: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}

@ChildEntity()
export class PasswordIdentity extends UserIdentity {
  @Column()
  password: string;
}
