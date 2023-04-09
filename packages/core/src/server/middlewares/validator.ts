import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ErrorResponse, ValidationException } from '../../base';
import { ServerMiddleware } from './interfaces';

export const validatorMiddleware: ServerMiddleware = async ({
  request,
  state,
  api,
}) => {
  if (api?.validator) {
    const rawData = Object.assign(
      {},
      request.params || {},
      api.method === 'get' ? request.query : request.body
    );
    const parsedData = plainToInstance(api.validator, rawData);

    const errors = validateSync(parsedData, {
      stopAtFirstError: true,
    });
    if (errors.length) {
      const i18n: ErrorResponse['i18n'] = {};
      errors.forEach((error) => {
        if (error.contexts) {
          i18n[error.property] = Object.values(error.contexts)[0];
        }
      });
      throw new ValidationException(i18n);
    }

    Object.assign(state, parsedData);
  }
};
