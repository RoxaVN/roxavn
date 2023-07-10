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
  // accesstoken id
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  token: string;

  @Column('text')
  provider: string;

  @Column('text')
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
