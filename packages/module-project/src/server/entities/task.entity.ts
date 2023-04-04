import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column('uuid', { array: true })
  parents: string[];

  @Column('int', { default: 0 })
  childrenCount = 0;

  @Column('float', { default: 0 })
  progress = 0;

  @Column('int', { default: 1 })
  weight = 1;

  @Column('character varying')
  status: string;

  @Column('character varying')
  title: string;

  @Column('character varying')
  content: string;

  @Column('uuid')
  projectId: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @Column({ type: 'timestamptz' })
  startedDate?: Date;

  @Column({ type: 'timestamptz' })
  finishedDate?: Date;

  @Column({ type: 'timestamptz' })
  rejectedDate?: Date;
}
