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
