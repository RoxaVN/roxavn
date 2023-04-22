import { BadRequestException } from '@roxavn/core/base';
import { baseModule } from './module';

export class InvalidExpiryDateException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.InvalidExpiryDateException',
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
