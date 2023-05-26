import { inject } from 'inversify';
import { EntityManager } from 'typeorm';

import { DatabaseService } from '../database/service.js';
import { BaseService, autoBind } from './base.js';

@autoBind()
export abstract class InjectDatabaseService extends BaseService {
  entityManager: EntityManager;

  constructor(
    @inject(DatabaseService) protected databaseService: DatabaseService
  ) {
    super();
    this.entityManager = databaseService.manager;
  }
}
