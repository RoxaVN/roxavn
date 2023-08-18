import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Web3Contract } from './web3.contract.entity.js';

@Entity()
@Index(['event', 'contractId'], { unique: true })
export class Web3EventCrawler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  event: string;

  @Column('uuid')
  contractId: string;

  @ManyToOne(() => Web3Contract, (contract) => contract.eventCrawlers)
  contract: Relation<Web3Contract>;

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
