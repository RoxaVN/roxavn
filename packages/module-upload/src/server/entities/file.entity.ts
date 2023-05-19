import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import { FileStorage } from './file.storage.entity';

@Entity()
export class File {
  @PrimaryColumn('varchar', { length: 64 })
  id: string;

  @Column('text')
  name: string;

  @Column('bigint')
  size: number;

  @Column('text')
  eTag: string;

  @Column('text')
  mime: string;

  @Column('text')
  url: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('uuid')
  fileStorageId: string;

  @ManyToOne(() => FileStorage, (fileStorage) => fileStorage.files)
  fileStorage: Relation<FileStorage>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
