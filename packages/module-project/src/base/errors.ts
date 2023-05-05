import { BadRequestException, I18nErrorField } from '@roxavn/core/base';
import { baseModule } from './module';

export class InvalidExpiryDateSubtaskException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InvalidExpiryDateSubtaskException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(maxExpiryDate: Date) {
    super();
    this.i18n.default.params = { maxExpiryDate };
  }
}

export class UnassignedTaskException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.UnassignedTaskException',
      ns: baseModule.escapedName,
    },
  };
}

export class DeleteTaskException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.DeleteTaskException',
      ns: baseModule.escapedName,
    },
  };
}
