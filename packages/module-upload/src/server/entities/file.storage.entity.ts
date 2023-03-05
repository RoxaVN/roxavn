import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { File } from './file.entity';

@Entity()
export class FileStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('uuid')
  userId: string;

  @OneToMany(() => File, (file) => file.fileStorage)
  files: File[];

  @Column({ default: 0 })
  currentSize: number = 0;

  @Column({ default: 0 })
  maxSize: number = 0;

  @Column({ default: 0 })
  maxFileSize: number = 0;

  @UpdateDateColumn()
  updatedDate: Date;
}
