import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ErrorResponse, ValidationException } from '../../base/index.js';
import { RouterContext } from '../service/context.js';
import { MiddlewareService } from './interfaces.js';
import { useApiMiddleware, useLoaderMiddleware } from './manager.js';

@useApiMiddleware()
@useLoaderMiddleware()
export class ValidatorMiddleware implements MiddlewareService {
  async handle(
    { api, state, helper }: RouterContext,
    next: () => Promise<void>
  ) {
    if (api?.validator) {
      const rawData = helper.getRequestData();
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

      Object.assign(state.request, parsedData);
    }
    next();
  }
}
