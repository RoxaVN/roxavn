import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileStorage } from './file.storage.entity';

@Entity()
export class File {
  @PrimaryColumn('varchar', { length: 33 })
  id: string;

  @Column('character varying')
  name: string;

  @Column('unsigned big int')
  size: number;

  @Column('character varying')
  etag: string;

  @Column('character varying')
  mime: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column()
  fileStorageId: string;

  @ManyToOne(() => FileStorage, (fileStorage) => fileStorage.files)
  fileStorage: FileStorage;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
