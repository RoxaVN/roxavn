import { BadRequestException, I18nErrorField } from '@roxavn/core/share';
import { baseModule } from './module';

export class ExceedsStorageLimitException extends BadRequestException {
  i18n = {
    default: {
      key: 'Error.ExceedsStorageLimitException',
      ns: baseModule.escapedName,
    } as I18nErrorField,
  };

  constructor(size: number) {
    super();
    this.i18n.default.params = { size };
  }
}

export class ExceedsUploadLimitException extends ExceedsStorageLimitException {
  i18n = {
    default: {
      key: 'Error.ExceedsUploadLimitException',
      ns: baseModule.escapedName,
    },
  };
}
