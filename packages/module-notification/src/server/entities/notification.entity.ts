import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity()
@Unique(['resource', 'resourceId', 'action', 'module'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  resource: string;

  @Column('text')
  resourceId: string;

  @Column('text')
  action: string;

  @Index()
  @Column('uuid', { nullable: true })
  actorId?: string;

  @Column('text')
  module: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
