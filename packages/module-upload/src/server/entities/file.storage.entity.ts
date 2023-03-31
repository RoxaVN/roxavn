import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { File } from './file.entity';

@Entity()
export class FileStorage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @OneToMany(() => File, (file) => file.fileStorage)
  files: File[];

  @Column('unsigned big int', { default: 0 })
  currentSize: number = 0;

  @Column('unsigned big int', { default: 0 })
  maxSize: number = 0;

  @Column('unsigned big int', { default: 0 })
  maxFileSize: number = 0;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
