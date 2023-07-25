import {
  BadRequestException,
  I18nErrorField,
  NotFoundException,
} from '@roxavn/core/base';

import { baseModule } from './module.js';

export class InvalidTotalTransactionAmountException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InvalidTotalTransactionAmountException',
      ns: baseModule.escapedName,
    },
  };
}

export class AccountNotFoundException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.AccountNotFoundException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(accountId: string) {
    super();
    this.i18n.default.params = { accountId };
  }
}

export class InsufficientBalanceException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InsufficientBalanceException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(accountId: string) {
    super();
    this.i18n.default.params = { accountId };
  }
}

export class AccountHasInvalidCurrencyException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.AccountHasInvalidCurrencyException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(accountId: string, currencyId: string) {
    super();
    this.i18n.default.params = { accountId, currencyId };
  }
}
