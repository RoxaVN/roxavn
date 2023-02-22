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

@Entity()
export class UserInfo {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

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
