import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';
import { FileInfo } from '@roxavn/module-upload/base';

@Entity()
export class UserInfo {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ type: 'timestamptz', nullable: true })
  birthday?: Date;

  @Column('character varying', { nullable: true })
  firstName?: string;

  @Column('character varying', { nullable: true })
  lastName?: string;

  @Column('character varying', { nullable: true })
  middleName?: string;

  @Column('character varying', { nullable: true })
  gender?: string;

  @Column({ type: 'jsonb', nullable: true })
  avatar?: FileInfo;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
