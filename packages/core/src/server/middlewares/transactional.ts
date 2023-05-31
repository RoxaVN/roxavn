import { Transactional } from 'typeorm-transactional';
import { RouterContext } from '../services/context.js';
import { MiddlewareService } from './interfaces.js';
import { useApiMiddleware, useLoaderMiddleware } from './manager.js';

@useApiMiddleware()
@useLoaderMiddleware()
export class TransactionalMiddleware implements MiddlewareService {
  @Transactional()
  async handle(ctx: RouterContext, next: () => Promise<void>) {
    return next();
  }
}
