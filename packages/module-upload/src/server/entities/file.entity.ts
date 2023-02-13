import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';

@Entity()
export class File {
  @PrimaryColumn('varchar', { length: 33 })
  id: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  etag: string;

  @Column()
  mime: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.identities)
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
