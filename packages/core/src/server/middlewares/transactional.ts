import { Transactional } from 'typeorm-transactional';
import { AlreadyExistsException } from '../../base/index.js';
import { RouterContext } from '../services/context.js';
import { serverModule } from '../module.js';
import { MiddlewareService } from '../middleware.js';

@serverModule.useApiMiddleware()
@serverModule.useLoaderMiddleware()
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
