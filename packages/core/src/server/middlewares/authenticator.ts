import { MiddlewareService } from '../middleware.js';
import { serverModule } from '../module.js';
import { ValidatorMiddleware } from './validator.js';

@serverModule.useApiMiddleware()
export class ApiAuthenticatorMiddleware implements MiddlewareService {
  after = [ValidatorMiddleware];

  async handle() {
    throw new Error('ApiAuthenticatorMiddleware is not implement');
  }
}

@serverModule.useLoaderMiddleware()
export class LoaderAuthenticatorMiddleware implements MiddlewareService {
  after = [ValidatorMiddleware];

  async handle() {
    throw new Error('LoaderAuthenticatorMiddleware is not implement');
  }
}
