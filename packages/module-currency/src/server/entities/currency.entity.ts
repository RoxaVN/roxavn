import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CurrencyAccount } from './currency.account.entity.js';
import { Transaction } from './transaction.entity.js';
import { AccountTransaction } from './account.transaction.entity.js';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('varchar', { length: 64 })
  symbol: string;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('text')
  fullName: string;

  @Column('varchar', { length: 64 })
  unitLabel: string;

  @Column('varchar', { length: 64 })
  subunitLabel: string;

  @Column('integer')
  decimalPlaces: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @OneToMany(
    () => CurrencyAccount,
    (currencyAccount) => currencyAccount.currency
  )
  accounts: Relation<CurrencyAccount>[];

  @OneToMany(() => CurrencyAccount, (transaction) => transaction.currency)
  transactions: Relation<Transaction>[];

  @OneToMany(
    () => AccountTransaction,
    (accountTransaction) => accountTransaction.currency
  )
  accountTransactions: Relation<AccountTransaction>[];
}
