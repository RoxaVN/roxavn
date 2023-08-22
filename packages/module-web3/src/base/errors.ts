import { I18nErrorField, NotFoundException } from '@roxavn/core';
import { baseModule } from './module.js';

export class NotFoundProviderException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.NotFoundProviderException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(networkId: string) {
    super();
    this.i18n.default.params = { networkId };
  }
}
