import { BadRequestException, I18nErrorField } from '@roxavn/core/base';
import { baseModule } from './module';

export class InvalidExpiryDateException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InvalidExpiryDateException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(maxExpiryDate: Date) {
    super();
    this.i18n.default.params = { maxExpiryDate };
  }
}

export class DeleteTaskException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.DeleteTaskException',
      ns: baseModule.escapedName,
    },
  };
}
