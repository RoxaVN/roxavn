import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Task } from './task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column('character varying')
  type: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('character varying')
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
