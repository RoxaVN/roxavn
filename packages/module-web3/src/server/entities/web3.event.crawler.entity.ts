import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['event', 'contractAddress', 'networkId'], { unique: true })
export class Web3EventCrawler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  event: string;

  @Column('text')
  contractAddress: string;

  @Column('bigint')
  networkId: string;

  @Column('text')
  provider: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('bigint')
  lastBlockNumber: string;

  @Column('int', { default: 10 })
  delayBlock: number;

  @Column('int', { default: 5000 })
  blockRange: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
