import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';
import { File } from './file.entity';

@Entity()
export class FileStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

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
