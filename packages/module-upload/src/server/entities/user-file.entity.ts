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
export class UserFile {
  @PrimaryColumn('varchar', { length: 33 })
  id: string;

  @Column()
  size: number;

  @Column()
  etag: string;

  @Column()
  mime: string;

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
