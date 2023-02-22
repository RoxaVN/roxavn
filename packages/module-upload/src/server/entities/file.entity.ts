import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';
import { FileStorage } from './file.storage.entity';

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

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.identities)
  user: User;

  @Column()
  fileStorageId: number;

  @ManyToOne(() => FileStorage, (fileStorage) => fileStorage.files)
  fileStorage: FileStorage;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
