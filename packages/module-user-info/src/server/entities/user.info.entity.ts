import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';

@Entity()
export class UserInfo {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => User, (owner) => owner.identities)
  @JoinColumn({ name: 'id' })
  owner: User;

  @Column({ type: 'timestamptz' })
  birthday?: Date;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  middleName?: string;

  @Column()
  gender?: string;

  @Column()
  avatar?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
