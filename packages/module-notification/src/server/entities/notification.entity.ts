import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['resource', 'resourceId', 'action', 'module'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  resource: string;

  @Column('character varying')
  resourceId: string;

  @Column('character varying')
  action: string;

  @Column('character varying')
  module: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
