import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Store } from '../entities/store.entity.js';

@serverModule.injectable()
export class CreateStoreService extends InjectDatabaseService {
  async handle(request: { userId: string; name: string; type: string }) {
    const store = new Store();
    store.userId = request.userId;
    store.name = request.name;
    store.type = request.type;
    await this.entityManager.save(store);

    return { id: store.id };
  }
}
