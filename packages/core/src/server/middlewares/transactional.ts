import { Transactional } from 'typeorm-transactional';
import { AlreadyExistsException } from '../../base/index.js';
import { RouterContext } from '../services/context.js';
import { MiddlewareService } from './interfaces.js';
import { useApiMiddleware, useLoaderMiddleware } from './manager.js';

@useApiMiddleware()
@useLoaderMiddleware()
export class TransactionalMiddleware implements MiddlewareService {
  @Transactional()
  async handle(ctx: RouterContext, next: () => Promise<void>) {
    try {
      await next();
    } catch (e: any) {
      if (e.code === '23505') {
        // duplicate key value violates unique constraint
        throw new AlreadyExistsException();
      } else {
        throw e;
      }
    }
  }
}
