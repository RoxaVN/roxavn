import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Web3Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  event: string;

  @Column('text')
  contractAddress: string;

  @Column('bigint')
  networkId: string;

  @Column('bigint')
  blockNumber: string;

  @Column('text')
  blockHash: string;

  @Index({ unique: true })
  @Column('text')
  transactionHash: string;

  @Column('bigint', { nullable: true })
  transactionIndex?: string;

  @Column('bigint', { nullable: true })
  logIndex?: string;

  @Column('text')
  signature: string;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
