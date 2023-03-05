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

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  etag: string;

  @Column()
  mime: string;

  @Index()
  @Column('uuid')
  userId: string;

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
