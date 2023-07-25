import { InjectDatabaseService } from '@roxavn/core/server';
import { sum } from 'lodash-es';
import { In } from 'typeorm';

import { serverModule } from '../module.js';
import {
  AccountTransaction,
  CurrencyAccount,
  Transaction,
} from '../entities/index.js';
import {
  AccountHasInvalidCurrencyException,
  AccountNotFoundException,
  InsufficientBalanceException,
  InvalidTotalTransactionAmountException,
} from '../../base/index.js';

@serverModule.injectable()
export class CreateTransactionService extends InjectDatabaseService {
  async handle(request: {
    currencyId: string;
    type?: string;
    originalTransactionId?: string;
    metadata?: Record<string, any>;
    accounts: Array<{
      id: string;
      amount: number;
    }>;
  }) {
    const total = sum(request.accounts.map((acc) => acc.amount));
    if (total !== 0) {
      throw new InvalidTotalTransactionAmountException();
    }

    const accounts = await this.entityManager
      .getRepository(CurrencyAccount)
      .find({
        lock: { mode: 'pessimistic_write' },
        where: {
          id: In(request.accounts.map((item) => item.id)),
        },
      });
    for (const accountInput of request.accounts) {
      const account = accounts.find((a) => a.id === accountInput.id);
      if (account) {
        if (account.currencyId !== request.currencyId) {
          throw new AccountHasInvalidCurrencyException(
            account.id,
            request.currencyId
          );
        }
        account.balance += accountInput.amount;
        if (account.balance < account.minBalance) {
          throw new InsufficientBalanceException(accountInput.id);
        }
      }
      throw new AccountNotFoundException(accountInput.id);
    }
    const transaction = new Transaction();
    Object.assign(transaction, request);

    await this.entityManager.save(transaction);

    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(AccountTransaction)
      .values(
        request.accounts.map((account) => ({
          accountId: account.id,
          transactionId: transaction.id,
          amount: account.amount,
          currencyId: request.currencyId,
        }))
      )
      .execute();

    // update balance of accounts
    this.entityManager.save(accounts);
  }
}
