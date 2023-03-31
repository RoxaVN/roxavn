import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NotificationToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column('character varying')
  token: string;

  @Column('character varying')
  provider: string;

  @Column('character varying')
  providerId: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('integer', { default: 0 })
  failCount: number;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
