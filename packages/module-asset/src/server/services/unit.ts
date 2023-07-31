import { NotFoundException } from '@roxavn/core/base';
import { InjectDatabaseService } from '@roxavn/core/server';

import { serverModule } from '../module.js';
import { Unit } from '../entities/index.js';

@serverModule.injectable()
export class CreateUnitService extends InjectDatabaseService {
  async handle(request: { name: string }) {
    const unit = new Unit();
    unit.name = request.name;

    await this.entityManager.save(unit);
    return { id: unit.id };
  }
}

@serverModule.injectable()
export class GetUnitService extends InjectDatabaseService {
  async handle(request: { name: string }) {
    const unit = await this.entityManager.getRepository(Unit).findOne({
      where: { name: request.name },
      cache: {
        milliseconds: 86400 * 1000, // a day
        id: 'getUnit' + request.name,
      },
    });
    if (unit) {
      return unit;
    }
    throw new NotFoundException();
  }
}
