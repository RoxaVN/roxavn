import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Web3Contract } from './web3.contract.entity.js';
import { Web3Event } from './web3.event.entity.js';
import { Web3EventConsumer } from './web3.event.consumer.entity.js';

@Entity()
@Index(['event', 'contractId'], { unique: true })
export class Web3EventCrawler {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('text')
  event: string;

  @Column('bigint')
  contractId: string;

  @ManyToOne(() => Web3Contract, (contract) => contract.eventCrawlers)
  contract: Relation<Web3Contract>;

  @OneToMany(() => Web3Event, (event) => event.crawler)
  events: Relation<Web3Event>[];

  @OneToMany(() => Web3EventConsumer, (consumer) => consumer.crawler)
  consumers: Relation<Web3EventConsumer>[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('bigint')
  lastCrawlBlockNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
