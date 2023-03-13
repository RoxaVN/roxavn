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
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column()
  status: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
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
