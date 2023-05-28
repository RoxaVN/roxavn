import { MiddlewareService } from './interfaces.js';
import { useApiMiddleware, useLoaderMiddleware } from './manager.js';
import { ValidatorMiddleware } from './validator.js';

@useApiMiddleware()
export class ApiAuthenticatorMiddleware implements MiddlewareService {
  after = [ValidatorMiddleware];

  async handle() {
    throw new Error('ApiAuthenticatorMiddleware is not implement');
  }
}

@useLoaderMiddleware()
export class LoaderAuthenticatorMiddleware implements MiddlewareService {
  after = [ValidatorMiddleware];

  async handle() {
    throw new Error('LoaderAuthenticatorMiddleware is not implement');
  }
}
