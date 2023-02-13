import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';

@Entity()
export class UserFile {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  currentStorageSize: number = 0;

  @Column({ default: 0 })
  maxStorageSize: number = 0;

  @Column({ default: 0 })
  maxFileSize: number = 0;

  @UpdateDateColumn()
  updatedDate: Date;
}
