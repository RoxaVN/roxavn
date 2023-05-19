import {
  BadRequestException,
  I18nErrorField,
  NotFoundException,
} from '@roxavn/core/base';

import { baseModule } from './module.js';

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

export class NotFoundStorageHandlerException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.NotFoundStorageHandlerException',
      ns: baseModule.escapedName,
    },
  };
}

export class NotFoundUserStorageException extends NotFoundException {
  i18n = {
    default: {
      key: 'Error.NotFoundUserStorageException',
      ns: baseModule.escapedName,
    },
  };
}
