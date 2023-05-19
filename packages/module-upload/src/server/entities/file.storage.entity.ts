import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { File } from './file.entity.js';

@Entity()
@Index(['userId', 'name'])
export class FileStorage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('text')
  name: string;

  @OneToMany(() => File, (file) => file.fileStorage)
  files: Relation<File>[];

  @Column('bigint', { default: 0 })
  currentSize: number = 0;

  @Column('bigint', { default: 0 })
  maxSize: number = 0;

  @Column('bigint', { default: 0 })
  maxFileSize: number = 0;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
