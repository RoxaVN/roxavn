import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Web3EventCrawler } from './web3.event.crawler.entity.js';
import { Web3Network } from './web3.network.entity.js';

@Entity()
export class Web3Contract {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('text')
  address: string;

  @Column('jsonb')
  abi: Record<string, any>;

  @Column('bigint')
  networkId: string;

  @ManyToOne(() => Web3Network, (network) => network.contracts)
  network: Relation<Web3Network>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => Web3EventCrawler, (eventCrawler) => eventCrawler.contract)
  eventCrawlers: Relation<Web3EventCrawler>[];
}
