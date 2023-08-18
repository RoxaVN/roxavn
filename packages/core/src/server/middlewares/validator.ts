import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ErrorResponse, ValidationException } from '../../base/index.js';
import { RouterContext } from '../services/context.js';
import { TransactionalMiddleware } from './transactional.js';
import { serverModule } from '../module.js';
import { MiddlewareService } from '../middleware.js';

@serverModule.useApiMiddleware()
@serverModule.useLoaderMiddleware()
export class ValidatorMiddleware implements MiddlewareService {
  after = [TransactionalMiddleware];

  async handle({ api, state }: RouterContext, next: () => Promise<void>) {
    if (api?.validator) {
      const parsedData = plainToInstance(api.validator, state.request);

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

      state.request = parsedData;
    }
    return next();
  }
}
