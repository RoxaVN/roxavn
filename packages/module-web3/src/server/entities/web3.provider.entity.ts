import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Web3Provider {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('bigint')
  networkId: string;

  @Column('text')
  url: string;

  @Column('int', { default: 10 })
  delayBlockCount: number;

  @Column('int', { default: 5000 })
  blockRangePerCrawl: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
