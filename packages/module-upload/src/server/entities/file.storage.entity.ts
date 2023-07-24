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

/**
 * public: anyone can access, can cache in cdn (best for fast response).
 *
 * private: must check permission to access (for security)
 */
export type StorageHandlerType = 'public' | 'private';

@Entity()
@Index(['userId', 'name'], { unique: true })
export class FileStorage {
  static NAME_DEFAULT = 'default';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('text')
  name: string;

  @Column('text')
  handler: string;

  @Column('text')
  type: StorageHandlerType;

  @OneToMany(() => File, (file) => file.fileStorage)
  files: Relation<File>[];

  @Column('bigint', { default: 0 })
  currentSize: number = 0;

  @Column('bigint', { default: 0 })
  maxSize: number = 0;

  @Column('bigint', { default: 0 })
  maxFileSize: number = 0;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
