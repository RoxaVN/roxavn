import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Web3Contract } from './web3.contract.entity.js';

@Entity()
export class Web3Network {
  @PrimaryColumn('bigint')
  id: string;

  @Column('text')
  providerUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => Web3Contract, (contract) => contract.network)
  contracts: Relation<Web3Contract>[];
}
