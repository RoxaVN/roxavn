import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['transactionHash', 'networkId'], { unique: true })
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

  @Column('text')
  transactionHash: string;

  @Column('int')
  transactionIndex: number;

  @Column('text')
  signature: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
