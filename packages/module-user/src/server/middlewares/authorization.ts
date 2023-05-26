import { serviceManager } from '@roxavn/core/server';

import { Role, UserRole } from '../entities/index.js';
import { Brackets } from 'typeorm';

export const checkUserPermission: typeof serviceManager.checkUserPermission =
  async (dbSession, userId, permission, scopes) => {
    const item = await dbSession
      .getRepository(UserRole)
      .createQueryBuilder('userRole')
      .leftJoin(Role, 'role', 'userRole.roleId = role.id')
      .select('userRole.userId')
      .where('userRole.userId = :userId', { userId })
      .andWhere(':permission = ANY(role.permissions)', { permission })
      .andWhere(
        new Brackets((qb) => {
          scopes.map((scope) => {
            qb.orWhere(
              new Brackets((qb1) => {
                qb1
                  .where('userRole.scope = :scope', { scope: scope.name })
                  .andWhere('userRole.scopeId = :scopeId', {
                    scopeId: scope.id || '',
                  });
              })
            );
          });
        })
      )
      .getRawOne();

    return !!item;
  };
