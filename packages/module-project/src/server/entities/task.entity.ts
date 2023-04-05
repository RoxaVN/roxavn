import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { constants } from '../../base';

import { Project } from './project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column('uuid')
  userId: string;

  @Index()
  @Column('uuid', { nullable: true })
  assignee?: string;

  @Column('bigint', { array: true, nullable: true })
  parents?: string[];

  @Column('int', { default: 0 })
  childrenCount = 0;

  @Column('float', { default: 0 })
  progress = 0;

  @Column('int', { default: 1 })
  weight = 1;

  @Column('character varying', { default: constants.TaskStatus.PENDING })
  status: string;

  @Column('character varying')
  title: string;

  @Column('character varying', { nullable: true })
  content?: string;

  @Column('bigint')
  projectId: number;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @Column({ type: 'timestamptz' })
  expiryDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startedDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  rejectedDate?: Date;
}
