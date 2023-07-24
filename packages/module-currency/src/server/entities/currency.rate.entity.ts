import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CurrencyRate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column('bigint')
  currency1: string;

  @Index()
  @Column('bigint')
  currency2: string;

  @Column('decimal')
  rate: number;

  @Column('varchar', { length: 64, default: '' })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
